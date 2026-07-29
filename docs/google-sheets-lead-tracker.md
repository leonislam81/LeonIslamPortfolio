# Google Sheets lead tracker

The quote form can add each successful enquiry to the **Leon Islam Leads** spreadsheet while keeping the integration secret on the server.

## 1. Create the Google Apps Script webhook

Open the lead spreadsheet, select **Extensions > Apps Script**, replace the contents of `Code.gs`, and save it.

```js
const SHEET_NAME = "Sheet1";

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const expectedToken = PropertiesService.getScriptProperties().getProperty("LEAD_WEBHOOK_SECRET");

    if (!expectedToken || payload.token !== expectedToken) {
      return json({ ok: false, error: "Unauthorized" });
    }

    const lead = payload.lead || {};
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`Sheet tab not found: ${SHEET_NAME}`);
    }

    sheet.appendRow([
      lead.receivedAt ? new Date(lead.receivedAt) : new Date(),
      lead.name || "",
      lead.email || "",
      lead.service || "",
      lead.timeline || "",
      lead.platform || "",
      lead.websiteUrl || "",
      lead.budget || "",
      lead.message || "",
      lead.source || "Website quote form",
      lead.status || "New",
      "",
      "",
    ]);

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Unable to record lead" });
  }
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

In **Project Settings > Script properties**, add `LEAD_WEBHOOK_SECRET`. Use a unique random value, then keep it private.

Deploy with **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then authorize and copy the Web app URL. The public endpoint remains protected because it rejects requests without the private secret.

## 2. Add Vercel environment variables

In Vercel, add these variables for Production (and Preview if desired):

```text
GOOGLE_SHEETS_WEBHOOK_URL=<your Apps Script Web app URL>
GOOGLE_SHEETS_WEBHOOK_SECRET=<the same LEAD_WEBHOOK_SECRET value>
```

Redeploy after saving the variables. A lead is recorded only after the enquiry email succeeds; a temporary Sheets failure never prevents the visitor from submitting the form.

## Audit lead follow-up

Free audit requests use the same sheet without any Apps Script changes. They are recorded with:

- **Service:** `Free website audit`
- **Source:** `Free website audit`
- **Status:** `Report sent — follow up by YYYY-MM-DD`
- **Timeline:** the same follow-up date
- **Message:** the audit scores, selected business goal, finding count, and follow-up date

Filter the Status column for `follow up by` each day to keep audit leads from being missed.
