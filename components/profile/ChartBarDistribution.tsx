import { useMantineTheme, Stack, SegmentedControl } from "@mantine/core";
import { GameEntryStatus, Genre, Platform } from "@api/types";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toProperCase } from "utils/helpers";
import { useState } from "react";
import { useMobile } from "utils/useMobile";

type Props = {
  gameStatusDistribution: Partial<Record<GameEntryStatus, number>>;
  gameGenreDistribution: Partial<Record<Genre, number>>;
  platformDistribution: Partial<Record<Platform, number>>;
  releaseYearDistribution: Record<number, number>;
  playYearDistribution: Record<number, number>;
};

enum ChartType {
  STATUS = "Status",
  GENRE = "Genre",
  PLATFORM = "Platform",
  RELEASE = "Release Date",
  PLAY_YEAR = "Play Year",
}

const ChartBarDistribution = (props: Props) => {
  const {
    gameStatusDistribution,
    gameGenreDistribution,
    platformDistribution,
    releaseYearDistribution,
    playYearDistribution,
  } = props;

  const [chartType, setChartType] = useState(ChartType.STATUS);

  const theme = useMantineTheme();
  const isMobile = useMobile();

  const gameStatusData = Object.entries(gameStatusDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      // Object.entries automatically maps the key into a String type
      // to get the original enum, we have to type case it to number :(
      label: toProperCase(GameEntryStatus[Number(key)]),
      value,
    };
  });

  const gameGenreData = Object.entries(gameGenreDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  const platformData = Object.entries(platformDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  const releaseYearData = Object.entries(releaseYearDistribution).map(
    (entry) => {
      const [key, value] = entry;

      return {
        label: key,
        value,
      };
    }
  );

  const playYearData = Object.entries(playYearDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  const chartData = {
    [ChartType.STATUS]: gameStatusData,
    [ChartType.GENRE]: gameGenreData,
    [ChartType.PLATFORM]: platformData,
    [ChartType.RELEASE]: releaseYearData,
    [ChartType.PLAY_YEAR]: playYearData,
  };

  const segmentedControlData = (
    Object.keys(ChartType) as (keyof typeof ChartType)[]
  ).map((key) => {
    return { label: ChartType[key], value: ChartType[key] };
  });

  const handleChange = (_value: string) => {
    const value = _value as ChartType;

    setChartType(value);
  };

  console.log(theme.fontFamily);

  return (
    <Stack align="center" sx={{ width: "100%" }}>
      <SegmentedControl
        value={chartType}
        onChange={handleChange}
        data={segmentedControlData}
        size={isMobile ? "xs" : "sm"}
      />
      <ResponsiveContainer height={256} width={isMobile ? "100%" : "80%"}>
        <BarChart
          data={chartData[chartType]}
          margin={isMobile ? { left: -30, right: 10 } : {}}
        >
          <XAxis
            dataKey="label"
            stroke={theme.colors.dark[0]}
            fontSize={isMobile ? "0.7rem" : "1rem"}
            fontFamily={theme.fontFamily}
          />
          <YAxis
            allowDecimals={false}
            stroke={theme.colors.dark[0]}
            fontFamily={theme.fontFamily}
          />
          <Tooltip
            cursor={{ fill: theme.fn.rgba(theme.colors.dark[0], 0.5) }}
          />
          <Bar
            name="count"
            dataKey="value"
            fill={theme.fn.primaryColor()}
            maxBarSize={64}
          />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default ChartBarDistribution;
