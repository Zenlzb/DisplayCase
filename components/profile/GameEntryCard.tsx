/* eslint-disable jsx-a11y/alt-text */
import { GameEntry, GameEntryStatus } from "@api/types";
import {
  Card,
  Image,
  Text,
  Group,
  Stack,
  Badge,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { TbEdit } from "react-icons/tb";

type Props = {
  gameEntry: GameEntry;
  onClickEdit?: (gameEntry: GameEntry) => void;
};

const GameEntryCard = (props: Props) => {
  const { gameEntry, onClickEdit } = props;
  const {
    game_id,
    game_name: title,
    game_cover: cover,
    rating,
    status,
  } = gameEntry;
  const { ref, hovered } = useHover();

  const badgeColor = {
    [GameEntryStatus.DROPPED]: "red",
    [GameEntryStatus.COMPLETED]: "green",
    [GameEntryStatus.PLAYING]: "yellow",
    [GameEntryStatus.BACKLOG]: "blue",
    [GameEntryStatus.WISHLIST]: "dark",
  };

  return (
    <Card>
      <Card.Section>
        <Grid grow>
          <Grid.Col span={2} p={0}>
            <Image
              width="100%"
              height="100%"
              src={cover}
              withPlaceholder
              sx={{ maxHeight: 70 }}
            />
          </Grid.Col>
          <Grid.Col span={8} p={0} pl="sm">
            <Stack>
              <Link href={`/games/${game_id}`}>
                <Text
                  mt="sm"
                  size="md"
                  weight={500}
                  sx={{ cursor: "pointer" }}
                  ref={ref}
                  underline={hovered}
                >
                  {title}
                </Text>
              </Link>
              <Group mb="sm">
                <Badge color={badgeColor[status]}>
                  {GameEntryStatus[status]}
                </Badge>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span="content" p={0}>
            <Group sx={{ height: "100%" }} position="right" mr="sm">
              {rating && (
                <Text size="md" align="right" weight={500}>
                  {rating}/10
                </Text>
              )}
              <ActionIcon
                mr="sm"
                onClick={() => {
                  onClickEdit && onClickEdit(gameEntry);
                }}
              >
                <TbEdit size={18} />
              </ActionIcon>
            </Group>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};

export default GameEntryCard;
