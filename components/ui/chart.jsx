import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const ChartConfig = {
  defaultCssVariables: {
    color: "hsl(var(--chart-1))",
  },
}

const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => (
  <div
    data-chart={id}
    ref={ref}
    className={cn(
      "flex aspect-video justify-center text-xs",
      className
    )}
    {...props}
  >
    <ChartStyle id={id} config={config} />
    <RechartsPrimitive.ResponsiveContainer>
      {children}
    </RechartsPrimitive.ResponsiveContainer>
  </div>
))
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config || {}).filter(
    ([_, config]) => (config).active || config?.active
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES).map(([theme, themeConfig]) => `
          #${id} {
            ${themeConfig.cssVars.color}
          }
        `).join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(({ active, payload, className }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1 rounded-lg border bg-background px-3 py-2 text-xs shadow-xl",
        className
      )}
    >
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <div className="flex flex-col">
            <span className="font-medium">{entry.name}</span>
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const THEMES = {
  light: {
    cssVars: {
      color: "hsl(var(--chart-1))",
    },
  },
  dark: {
    cssVars: {
      color: "hsl(var(--chart-1))",
    },
  },
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig }
