"use client";

import { AnimatePresence, motion } from "motion/react";
import { DemoPhoneContainer } from "./demo-phone-container";
import { useDemoState } from "./hooks/use-demo-state";
import { DemoStatusBar } from "./components/demo-status-bar";
import { DemoHeader } from "./components/demo-header";
import { DemoBottomNav } from "./components/demo-bottom-nav";
import { DemoQuickActions } from "./components/demo-quick-actions";
import { DemoFridgeView } from "./components/demo-fridge-view";
import { DemoTimerView } from "./components/demo-timer-view";
import { DemoRecipesView } from "./components/demo-recipes-view";
import { DemoStatsView } from "./components/demo-stats-view";

/**
 * Main orchestrator for the demo phone content.
 * Manages navigation between tabs and all interactive elements.
 */
export function DemoPhoneContent() {
  const demoState = useDemoState();

  return (
    <DemoPhoneContainer>
      {/* iOS Status Bar */}
      <DemoStatusBar />

      {/* Header with title and actions */}
      <DemoHeader activeTab={demoState.activeTab} />

      {/* Main Content - Scrollable */}
      <div className="scrollbar-none relative flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {demoState.activeTab === "fridge" && (
            <motion.div
              key="fridge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DemoFridgeView />
            </motion.div>
          )}

          {demoState.activeTab === "timer" && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DemoTimerView
                selectedCooking={demoState.selectedCooking}
                selectedOption={demoState.selectedOption}
                timerRunning={demoState.timerRunning}
                timerSeconds={demoState.timerSeconds}
                timerProgress={demoState.timerProgress}
                totalSeconds={demoState.totalSeconds}
                handleCookingChange={demoState.handleCookingChange}
                toggleTimer={demoState.toggleTimer}
                resetTimer={demoState.resetTimer}
                formatTime={demoState.formatTime}
              />
            </motion.div>
          )}

          {demoState.activeTab === "recipes" && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DemoRecipesView />
            </motion.div>
          )}

          {demoState.activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DemoStatsView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <DemoBottomNav
        activeTab={demoState.activeTab}
        onTabChange={demoState.setActiveTab}
        onFabClick={() => demoState.setQuickActionsOpen(true)}
      />

      {/* Quick Actions Sheet */}
      <DemoQuickActions
        open={demoState.isQuickActionsOpen}
        onClose={() => demoState.setQuickActionsOpen(false)}
      />
    </DemoPhoneContainer>
  );
}
