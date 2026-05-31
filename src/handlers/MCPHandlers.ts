import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TrelloApi } from "../api/trelloApi";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  TRELLO_API_KEY,
  TRELLO_BASE_URL,
  TRELLO_TOKEN,
} from "../config/config";
import { createToolHandlers } from "./toolHandlers";
import { toolsMetadata } from "../metadata/toolsMetadata";

const trello = new TrelloApi(
  TRELLO_API_KEY ?? "",
  TRELLO_TOKEN ?? "",
  TRELLO_BASE_URL
);
const toolHandlers = createToolHandlers(trello);

export const mcpServer = new Server(
  {
    name: "trello-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

mcpServer.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    const boards = await trello.get("/members/me/boards", {
      fields: "id,name,closed",
    });
    const openBoards = boards.filter((b: any) => !b.closed);

    return {
      resources: openBoards.map((board: any) => ({
        uri: `board:${board.id}`,
        name: board.name,
        description: `Trello board: ${board.name}`,
        mimeType: "application/json",
      })),
    };
  } catch (error) {
    console.error("Error fetching boards:", error);
    return {
      resources: [],
    };
  }
});

mcpServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resourceId = request.params.uri;
  if (!resourceId.startsWith("board:")) {
    throw new Error("Only board resources are supported");
  }

  const boardId = resourceId.split(":")[1];

  try {
    const lists = await trello.get(`/boards/${boardId}/lists`, {
      fields: "id,name,closed",
    });
    const openLists = lists.filter((list: any) => !list.closed);

    const listWithCards = await Promise.all(
      openLists.map(async (list: any) => {
        const cards = await trello.get(`/lists/${list.id}/cards`, {
          fields: "id,name,closed",
        });
        const openCards = cards.filter((card: any) => !card.closed);
        return {
          listId: list.id,
          listName: list.name,
          cards: openCards.map((card: any) => ({
            id: card.id,
            name: card.name,
            description: `Trello card: ${card.name} in list ${list.name}`,
          })),
        };
      })
    );

    return {
      contents: [
        {
          uri: resourceId,
          mimeType: "application/json",
          text: JSON.stringify(
            {
              boardId,
              lists: listWithCards,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    console.error("Error reading board:", error);
    throw error;
  }
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "list_boards":
        result = await toolHandlers.handleListBoards();
        break;
      case "read_board":
        result = await toolHandlers.handleReadBoard(args);
        break;
      case "create_list":
        result = await toolHandlers.handleCreateList(args);
        break;
      case "create_card":
        result = await toolHandlers.handleCreateCard(args);
        break;
      case "move_card":
        result = await toolHandlers.handleMoveCard(args);
        break;
      case "add_comment":
        result = await toolHandlers.handleAddComment(args);
        break;
      case "archive_card":
        result = await toolHandlers.handleArchiveCard(args);
        break;
      case "archive_list":
        result = await toolHandlers.handleArchiveList(args);
        break;
      case "delete_board":
        result = await toolHandlers.handleDeleteBoard(args);
        break;
      case "update_list_name":
        result = await toolHandlers.handleUpdateListName(args);
        break;
      case "update_card_name":
        result = await toolHandlers.handleUpdateCardName(args);
        break;
      case "get_card":
        result = await toolHandlers.handleGetCard(args);
        break;
      case "get_card_comments":
        result = await toolHandlers.handleGetCardComments(args);
        break;
      case "update_comment":
        result = await toolHandlers.handleUpdateComment(args);
        break;
      case "delete_comment":
        result = await toolHandlers.handleDeleteComment(args);
        break;
      case "get_labels":
        result = await toolHandlers.handleGetLabels(args);
        break;
      case "create_label":
        result = await toolHandlers.handleCreateLabel(args);
        break;
      case "add_label_to_card":
        result = await toolHandlers.handleAddLabelToCard(args);
        break;
      case "remove_label_from_card":
        result = await toolHandlers.handleRemoveLabelFromCard(args);
        break;
      case "get-boards":
        result = await toolHandlers.handleListBoards();
        break;
      case "get-lists":
        result = await toolHandlers.handleGetLists(args);
        break;
      case "create-card":
        result = await toolHandlers.handleCreateCard(args);
        break;
      case "create-cards":
        result = await toolHandlers.handleCreateCards(args);
        break;
      case "move-card":
        result = await toolHandlers.handleMoveCard(args);
        break;
      case "move-cards":
        result = await toolHandlers.handleMoveCards(args);
        break;
      case "add-comment":
        result = await toolHandlers.handleAddComment(args);
        break;
      case "add-comments":
        result = await toolHandlers.handleAddComments(args);
        break;
      case "create-label":
        result = await toolHandlers.handleCreateLabel(args);
        break;
      case "create-labels":
        result = await toolHandlers.handleCreateLabels(args);
        break;
      case "add-label":
        result = await toolHandlers.handleAddLabelToCard(args);
        break;
      case "add-labels":
        result = await toolHandlers.handleAddLabels(args);
        break;
      case "get-tickets-by-list":
        result = await toolHandlers.handleGetTicketsByList(args);
        break;
      case "archive-card":
        result = await toolHandlers.handleArchiveCard(args);
        break;
      case "archive-cards":
        result = await toolHandlers.handleArchiveCards(args);
        break;

      default:
        throw new Error(`Tool "${name}" is not implemented`);
    }

    return result;
  } catch (e) {
    console.error(`Error in tool handler for ${name}:`, e);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            typeof e === "object" && e !== null && "message" in e
              ? (e as { message: string }).message
              : String(e)
          }`,
        },
      ],
    };
  }
});

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolsMetadata,
  };
});
