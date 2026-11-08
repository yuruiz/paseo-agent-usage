import type { PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { Pressable, Text, View } from "react-native";
import { useMemo } from "react";
import { useFleet } from "./fleet";
import { footerTotals } from "../shared/fleet";
import { formatTokens } from "./format";
import { AGENT_USAGE_ICON } from "./icons";
import { useI18n } from "./i18n";

export function UsageSidebarItem({ currentScreen, openScreen, theme, layout }: PluginSidebarItemProps) {
  const { fleet } = useFleet();
  const { t } = useI18n();
  const totals = useMemo(() => footerTotals(fleet.state), [fleet]);
  const open = () => openScreen({ screenId: "usage" });
  const ranges = ["24h", "7d", "30d"] as const;
  const labels = ["fleet.day", "fleet.week", "fleet.month"] as const;
  return (
    <View>
      <SidebarRow
        icon={{ svg: AGENT_USAGE_ICON }}
        label="Agent Usage"
        active={currentScreen?.screenId === "usage"}
        onPress={open}
      />
      <Pressable accessibilityRole="button" onPress={open}
        accessibilityLabel={`${t("fleet.footer")}: ${ranges.map((range, index) => `${t(labels[index])} ${fleet.hasData ? totals[range] : "—"}`).join(", ")}`}
        style={{ paddingHorizontal: layout.compact ? 8 : 12, paddingBottom: 8, gap: 4 }}>
        <Text style={{ color: theme.colors.foregroundMuted, fontSize: 10 }}>{t("fleet.footer")}</Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {ranges.map((range, index) => (
            <View key={range} style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text style={{ color: theme.colors.foregroundMuted, fontSize: 10 }}>{range}</Text>
              <Text numberOfLines={1} accessibilityLabel={t(labels[index])}
                style={{ color: theme.colors.foreground, fontSize: 12, fontVariant: ["tabular-nums"] }}>
                {fleet.hasData ? formatTokens(totals[range]) : "—"}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ color: theme.colors.foregroundMuted, fontSize: 10 }}>
          {t(fleet.partial ? "fleet.partial" : "fleet.ready", { ready: fleet.ready, total: fleet.total })}
        </Text>
      </Pressable>
    </View>
  );
}
