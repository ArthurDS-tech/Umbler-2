"use client"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  type ChartConfig,
  ChartContainer as RechartsChartContainer,
  ChartTooltip as RechartsChartTooltip,
  ChartTooltipContent as RechartsChartTooltipContent,
} from "@/components/ui/chart" // Assuming chart.tsx is in components/ui/chart

// Re-exporting the components from shadcn/ui/chart
export {
  RechartsChartContainer as ChartContainer,
  RechartsChartTooltip as ChartTooltip,
  RechartsChartTooltipContent as ChartTooltipContent,
}

// Re-exporting Recharts components for direct use
export {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
}

// Example of a custom Chart component using Recharts and shadcn/ui Chart components
interface ExampleLineChartProps {
  data: any[]
  config: ChartConfig
  lineKeys: { dataKey: string; stroke: string; name: string }[]
  xAxisDataKey: string
  title?: string
  description?: string
}

export function ExampleLineChart({ data, config, lineKeys, xAxisDataKey, title, description }: ExampleLineChartProps) {
  return (
    <RechartsChartContainer config={config} className="min-h-[200px] w-full">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisDataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <Tooltip content={<RechartsChartTooltipContent />} />
          {lineKeys.map((key) => (
            <Line
              key={key.dataKey}
              dataKey={key.dataKey}
              stroke={key.stroke}
              name={key.name}
              type="monotone"
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </RechartsChartContainer>
  )
}

// Example of a custom Bar Chart component
interface ExampleBarChartProps {
  data: any[]
  config: ChartConfig
  barKeys: { dataKey: string; fill: string; name: string }[]
  xAxisDataKey: string
  title?: string
  description?: string
}

export function ExampleBarChart({ data, config, barKeys, xAxisDataKey, title, description }: ExampleBarChartProps) {
  return (
    <RechartsChartContainer config={config} className="min-h-[200px] w-full">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xAxisDataKey} tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <Tooltip content={<RechartsChartTooltipContent />} />
          {barKeys.map((key) => (
            <Bar key={key.dataKey} dataKey={key.dataKey} fill={key.fill} name={key.name} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </RechartsChartContainer>
  )
}

// Example of a custom Pie Chart component
interface ExamplePieChartProps {
  data: any[]
  config: ChartConfig
  dataKey: string
  nameKey: string
  title?: string
  description?: string
}

export function ExamplePieChart({ data, config, dataKey, nameKey, title, description }: ExamplePieChartProps) {
  return (
    <RechartsChartContainer config={config} className="min-h-[200px] w-full">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip content={<RechartsChartTooltipContent />} />
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} label />
        </PieChart>
      </ResponsiveContainer>
    </RechartsChartContainer>
  )
}

// Example of a custom Radial Bar Chart component
interface ExampleRadialBarChartProps {
  data: any[]
  config: ChartConfig
  dataKey: string
  nameKey: string
  title?: string
  description?: string
}

export function ExampleRadialBarChart({
  data,
  config,
  dataKey,
  nameKey,
  title,
  description,
}: ExampleRadialBarChartProps) {
  return (
    <RechartsChartContainer config={config} className="min-h-[200px] w-full">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart innerRadius="10%" outerRadius="80%" data={data}>
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff" }}
            background
            clockWise
            dataKey={dataKey}
          />
          <Tooltip content={<RechartsChartTooltipContent />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </RechartsChartContainer>
  )
}

// Example of a custom Area Chart component
interface ExampleAreaChartProps {
  data: any[]
  config: ChartConfig
  areaKeys: { dataKey: string; stroke: string; fill: string; name: string }[]
  xAxisDataKey: string
  title?: string
  description?: string
}

export function ExampleAreaChart({ data, config, areaKeys, xAxisDataKey, title, description }: ExampleAreaChartProps) {
  return (
    <RechartsChartContainer config={config} className="min-h-[200px] w-full">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xAxisDataKey} tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <Tooltip content={<RechartsChartTooltipContent />} />
          {areaKeys.map((key) => (
            <Area
              key={key.dataKey}
              type="monotone"
              dataKey={key.dataKey}
              stroke={key.stroke}
              fill={key.fill}
              name={key.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </RechartsChartContainer>
  )
}
