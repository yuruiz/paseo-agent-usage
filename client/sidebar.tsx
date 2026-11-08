import type { PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { Pressable, Text } from "react-native";
import { useMemo } from "react";
import { useFleet } from "./fleet";
import { footerTotals } from "../shared/fleet";
import { formatTokens } from "./format";
import { useI18n } from "./i18n";

export function UsageSidebarItem({ openScreen, theme, layout }: PluginSidebarItemProps) {
  const { fleet } = useFleet();
  const { t } = useI18n();
  const totals = useMemo(() => footerTotals(fleet.state), [fleet]);
  const ranges = ["24h", "7d", "30d"] as const;
  const labels = ["fleet.day", "fleet.week", "fleet.month"] as const;
  const summary = ranges.map((range) => `${range} ${fleet.hasData ? formatTokens(totals[range]) : "—"}`).join(" · ");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ranges.map((range, index) => `${t(labels[index])} ${fleet.hasData ? totals[range] : "—"}`).join(", ")}
      onPress={() => openScreen({ screenId: "usage" })}
      style={{ paddingHorizontal: layout.compact ? 8 : 12, paddingVertical: 4 }}
    >
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}
        style={{ color: theme.colors.foregroundMuted, fontSize: 11, lineHeight: 16, fontVariant: ["tabular-nums"] }}>
        {summary}
      </Text>
    </Pressable>
  );
}
