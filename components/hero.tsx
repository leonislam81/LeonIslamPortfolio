'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  Zap,
  Search,
  CheckCircle,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

const headlineWords = ['I', 'build,', 'fix', '&', 'manage', 'modern', 'websites.'];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const hero = heroRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let removePointerListener: (() => void) | undefined;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

      if (headlineRef.current) {
        tl.from(headlineRef.current.querySelectorAll('[data-hero-word]'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
        });
      }

      tl.from(
        subheadRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.4'
      );

      tl.from(
        ctaRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.4)',
        },
        '-=0.3'
      );

      tl.from(
        badgesRef.current?.children || [],
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.2)',
        },
        '-=0.4'
      );

      tl.from(
        scrollCueRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
        },
        '-=0.2'
      );

      if (backgroundRef.current) {
        gsap.to(backgroundRef.current.children, {
          y: -50,
          duration: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (scrollCueRef.current) {
        gsap.to(scrollCueRef.current, {
          y: 8,
          duration: 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      if (cursorRef.current && window.matchMedia('(pointer: fine)').matches) {
        const moveCursorX = gsap.quickTo(cursorRef.current, 'x', { duration: 0.35, ease: 'power3.out' });
        const moveCursorY = gsap.quickTo(cursorRef.current, 'y', { duration: 0.35, ease: 'power3.out' });
        const handleMouseMove = (event: MouseEvent) => {
          const rect = hero.getBoundingClientRect();
          moveCursorX(event.clientX - rect.left - 24);
          moveCursorY(event.clientY - rect.top - 24);
        };
        hero.addEventListener('mousemove', handleMouseMove, { passive: true });
        removePointerListener = () => hero.removeEventListener('mousemove', handleMouseMove);
      }
    }, hero);

    return () => {
      removePointerListener?.();
      ctx.revert();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: sectionId, offsetY: 80 },
      ease: 'power2.inOut',
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[580px] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 sm:min-h-[640px]"
    >
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-portfolio-primary/20 to-portfolio-accent/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-portfolio-accent/20 to-portfolio-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-portfolio-primary/10 to-portfolio-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div
        ref={cursorRef}
        className="absolute w-12 h-12 pointer-events-none z-20 hidden lg:block"
      >
        <div className="w-full h-full bg-gradient-to-r from-portfolio-primary/30 to-portfolio-accent/30 rounded-full blur-sm animate-pulse" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 heroBox__container">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
          >
            {headlineWords.map((word, index) => (
              <span key={`${word}-${index}`} data-hero-word className="inline-block">
                {word}{index < headlineWords.length - 1 ? '\u00a0' : ''}
              </span>
            ))}
          </h1>

          <p
            ref={subheadRef}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            WordPress • Shopify • Wix — fast, reliable, and conversion-ready.
          </p>

          <div
            ref={ctaRef}
            className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          >
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-portfolio-primary to-portfolio-accent px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-portfolio-primary/90 hover:to-portfolio-accent/90 hover:shadow-xl sm:w-auto"
              onClick={() => scrollToSection('#contact')}
            >
              Hire Me
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-2 border-portfolio-primary/50 bg-white/5 px-8 py-6 text-lg font-semibold text-portfolio-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-portfolio-primary/10 sm:w-auto dark:bg-black/5"
              onClick={() => scrollToSection('#projects')}
            >
              View Projects
            </Button>
          </div>

          <div
            ref={badgesRef}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-portfolio-primary" />
              Fast Turnaround
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              <Search className="w-4 h-4 text-portfolio-primary" />
              SEO-Friendly
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              <CheckCircle className="w-4 h-4 text-portfolio-primary" />
              100+ Tasks Managed
            </Badge>
          </div>
        </div>

        <Button
          ref={scrollCueRef}
          variant="ghost"
          size="icon"
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10"
          onClick={() => scrollToSection('#services')}
          aria-label="Scroll to services section"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}
