"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

type DaySale = {
  date: string;
  revenue: number;
  orders: number;
};

interface Props {
  data: DaySale[];
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");

  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
  })}`;

export default function SalesChart({ data }: Props) {
  const [metric, setMetric] = useState<"revenue" | "orders">(
    "revenue"
  );

  const chartData = data.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  const isRevenue = metric === "revenue";

  return (
    <div className="sales-chart-card">
      <div className="sales-chart-header">
        <div>
          <h2
            className="admin-section-title"
            style={{
              marginBottom: "0.05rem",
              fontSize: "0.82rem",
            }}
          >
            Ventas por día
          </h2>

          <p
            className="admin-page-subtitle"
            style={{ fontSize: "0.68rem" }}
          >
            Últimos 30 días
          </p>
        </div>

        <div className="sales-chart-toggle">
          <button
            className={`toggle-btn ${
              metric === "revenue" ? "active" : ""
            }`}
            onClick={() => setMetric("revenue")}
          >
            Ingresos
          </button>

          <button
            className={`toggle-btn ${
              metric === "orders" ? "active" : ""
            }`}
            onClick={() => setMetric("orders")}
          >
            Pedidos
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: -10,
            bottom: -10,
          }}
        >
          <defs>
            <linearGradient
              id="colorRevenue"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--color-success)"
                stopOpacity={0.18}
              />

              <stop
                offset="95%"
                stopColor="var(--color-success)"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient
              id="colorOrders"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--color-info)"
                stopOpacity={0.18}
              />

              <stop
                offset="95%"
                stopColor="var(--color-info)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="2 2"
            stroke="var(--color-border)"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: 9,
              fill: "var(--color-muted)",
            }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />

          <YAxis
            tick={{
              fontSize: 9,
              fill: "var(--color-muted)",
            }}
            tickLine={false}
            axisLine={false}
            width={42}
            tickFormatter={
              isRevenue
                ? (v) =>
                    v >= 1000
                      ? `$${(v / 1000).toFixed(0)}k`
                      : `$${v}`
                : undefined
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor:
                "var(--color-surface-alt)",

              border:
                "1px solid var(--color-border)",

              borderRadius: "0.6rem",

              fontSize: "0.72rem",

              padding: "0.45rem 0.6rem",
            }}
            labelStyle={{
              color: "var(--color-foreground)",
              fontWeight: 600,
              marginBottom: "0.2rem",
            }}
            itemStyle={{
              color: isRevenue
                ? "var(--color-success)"
                : "var(--color-info)",
            }}
            formatter={(value) => {
              const num =
                typeof value === "number" ? value : 0;

              return isRevenue
                ? [formatCurrency(num), "Ingresos"]
                : [num, "Pedidos"];
            }}
          />

          <Area
            type="monotone"
            dataKey={metric}
            stroke={
              isRevenue
                ? "var(--color-success)"
                : "var(--color-info)"
            }
            strokeWidth={1.8}
            fill={
              isRevenue
                ? "url(#colorRevenue)"
                : "url(#colorOrders)"
            }
            dot={false}
            activeDot={{
              r: 3,
              strokeWidth: 0,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}