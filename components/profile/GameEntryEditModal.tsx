import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
import { Game, GameEntry } from "@api/types";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useAppDispatch } from "@redux/hooks";
import { updateGameEntry } from "@redux/slices/GameEntry_slice";
import { useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";
import { STATUS_DATA } from "utils/status";

interface FormValues {
  status: string;
  rating: string;
  platforms: string[];
  review: string;
}

type Props = {
  opened: boolean;
  onClose: () => void;
  gameEntry: GameEntry;
};

const GameEntryEditModal = (props: Props) => {
  const { opened, onClose, gameEntry } = props;

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useMantineTheme();
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);

    getGameByIdApi(gameEntry.game_id)
      .then((game) => {
        setGame(game);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gameEntry.game_id]);

  const form = useForm<FormValues>({
    initialValues: {
      status: String(gameEntry.status),
      rating: String(gameEntry.rating),
      platforms: gameEntry.platforms || [],
      review: String(gameEntry.review),
    },

    validate: {
      status: (value) =>
        value && value !== "undefined" ? null : "Status is required",
    },
  });

  const handleSubmit = (values: FormValues) => {
    const newGameEntry: GameEntry = {
      ...gameEntry,
      platforms: values.platforms,
      status: Number(values.status),
      rating: Number(values.rating),
      review: values.review,
    };

    dispatch(updateGameEntry(newGameEntry))
      .unwrap()
      .then(() => {
        onClose();
        showSuccessNotification({
          title: "Entry updated",
          message: gameEntry.game_name,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={gameEntry.game_name}
      size={isScreenSmall ? "md" : "lg"}
    >
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Status"
          placeholder="Pick one"
          data={STATUS_DATA}
          {...form.getInputProps("status")}
        />
        <Select
          label="Rating"
          placeholder="Out of 10"
          data={Array(11)
            .fill(0)
            .map((_, index) => `${index}`)}
          {...form.getInputProps("rating")}
        />
        <MultiSelect
          label="Platform"
          placeholder="Pick any"
          data={game?.platforms || []}
          {...form.getInputProps("platforms")}
        />
        <Textarea
          label="Review"
          placeholder="Write a Review"
          autosize
          minRows={2}
          maxRows={6}
          {...form.getInputProps("review")}
        />

        <Group position="right">
          <Button type="submit" mt="md">
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default GameEntryEditModal;
