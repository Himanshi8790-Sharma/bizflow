"use client";

import React from "react";
import { TrendingUp, Zap, Users, ArrowUpRight, BarChart3 } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function MarketingPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full p-8 lg:p-10 xl:p-12 overflow-hidden bg-muted/40 border-r border-border select-none">
      {/* Background Animated Gradient Mesh Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl animate-pulse-glow" style={{ animationDelay: "4s" }} />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <BrandLogo size="md" showTagline />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary backdrop-blur-md">
          <Zap className="w-3.5 h-3.5" />
          <span>v2.4 Platform Release</span>
        </div>
      </div>

      {/* Center Visualization Showcase */}
      <div className="relative z-10 my-auto py-4">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Unified Business Intelligence</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            Automate workflows. <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Scale revenue effortlessly.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            BizFlow connects your cashflow analytics, customer operations, and team execution into one real-time dashboard.
          </p>
        </div>

        {/* Abstract SaaS Visual Mockup Stack */}
        <div className="relative mt-8 w-full max-w-md">
          {/* Main Floating Glass Card - Revenue Graph */}
          <div className="glass-panel rounded-xl p-5 shadow-xl transition-transform duration-500 hover:scale-[1.01] border border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Monthly Recurring Revenue</p>

                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold tracking-tight text-foreground">$128,450.00</span>

                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24.8%
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>

            {/* Sparkline Visualization */}
            <div className="h-16 w-full flex items-end gap-1.5 pt-1">
              {[35, 45, 40, 60, 55, 75, 70, 85, 95, 88, 100].map((height, i) => (
                <div key={i} className="flex-1 bg-secondary rounded-t overflow-hidden flex items-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-t transition-all duration-500 hover:brightness-125"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border text-[11px] text-muted-foreground">
              <span>Target: $150K / mo</span>
              <span className="font-semibold text-foreground">85.6% achieved</span>
            </div>
          </div>

          {/* Floating Badge 1 - Live Transaction */}
          <div className="absolute -top-4 -right-3 glass-panel rounded-lg p-2.5 shadow-lg flex items-center gap-2.5 animate-float-slow border border-border">
            <div className="w-7 h-7 rounded-md bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground">Enterprise Renewal</p>
              <p className="text-[10px] text-muted-foreground">Acme Corp • +$12,000</p>
            </div>
          </div>

          {/* Floating Badge 2 - Active Users */}
          <div className="absolute -bottom-4 -left-3 glass-panel rounded-lg p-2.5 shadow-lg flex items-center gap-2.5 animate-float-reverse border border-border">
            <div className="w-7 h-7 rounded-md bg-primary/15 text-primary flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground">Active Team Seats</p>
              <p className="text-[10px] text-muted-foreground">1,420 online now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Social Proof / Testimonial */}
      {/* <div className="relative z-10 pt-4 border-t border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 overflow-hidden">
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white">
              JD
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-[9px] font-bold text-white">
              AK
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-[9px] font-bold text-white">
              SL
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              {"★".repeat(5)}
              <span className="ml-1 text-[10px] font-semibold text-foreground">4.9 / 5.0</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Trusted by 10,000+ fast-growing modern businesses
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
