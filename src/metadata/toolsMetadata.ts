export const toolsMetadata = [
  {
    name: "list_boards",
    description: "List all open Trello boards",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "read_board",
    description: "Read lists and cards from a specific board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to read",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "create_list",
    description: "Create a new list in a specific board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to create the list in",
        },
        name: {
          type: "string",
          description: "Name of the list",
        },
      },
      required: ["boardId", "name"],
    },
  },
  {
    name: "create_card",
    description: "Create a new card in a specific list",
    inputSchema: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "ID of the list to create the card in",
        },
        name: {
          type: "string",
          description: "Name of the card",
        },
        desc: {
          type: "string",
          description: "Description of the card (optional)",
        },
      },
      required: ["listId", "name"],
    },
  },
  {
    name: "move_card",
    description: "Move a card to a different list",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to move",
        },
        listId: {
          type: "string",
          description: "ID of the target list",
        },
      },
      required: ["cardId", "listId"],
    },
  },
  {
    name: "add_comment",
    description: "Add a comment to a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to add a comment to",
        },
        text: {
          type: "string",
          description: "Comment text",
        },
      },
      required: ["cardId", "text"],
    },
  },
  {
    name: "archive_card",
    description: "Archive a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to archive",
        },
      },
      required: ["cardId"],
    },
  },
  {
    name: "archive_list",
    description: "Archive a list",
    inputSchema: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "ID of the list to archive",
        },
      },
      required: ["listId"],
    },
  },
  {
    name: "delete_board",
    description: "Delete a board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to delete",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "update_list_name",
    description: "Update a list name",
    inputSchema: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "ID of the list to be updated",
        },
        name: {
          type: "string",
          description: "New name of the card",
        },
      },
      required: ["listId", "name"],
    },
  },
  {
    name: "update_card_name",
    description: "Update a card name",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to be updated",
        },
        name: {
          type: "string",
          description: "New name of the card",
        },
      },
      required: ["cardId", "name"],
    },
  },
  {
    name: "get_card",
    description: "Get full details of a card including its description",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to read",
        },
      },
      required: ["cardId"],
    },
  },
  {
    name: "get_card_comments",
    description: "Get all comments on a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to get comments from",
        },
      },
      required: ["cardId"],
    },
  },
  {
    name: "update_comment",
    description: "Update the text of an existing comment on a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card the comment belongs to",
        },
        commentId: {
          type: "string",
          description: "ID of the comment to update",
        },
        text: {
          type: "string",
          description: "New text for the comment",
        },
      },
      required: ["cardId", "commentId", "text"],
    },
  },
  {
    name: "delete_comment",
    description: "Delete a comment from a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card the comment belongs to",
        },
        commentId: {
          type: "string",
          description: "ID of the comment to delete",
        },
      },
      required: ["cardId", "commentId"],
    },
  },
  {
    name: "get_labels",
    description: "Get all labels defined on a board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to retrieve labels from",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "create_label",
    description: "Create a new label on a board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to create the label on",
        },
        name: {
          type: "string",
          description: "Name of the label",
        },
        color: {
          type: "string",
          description:
            "Color of the label. One of: yellow, purple, blue, red, green, orange, black, sky, pink, lime. Omit for no color.",
        },
      },
      required: ["boardId", "name"],
    },
  },
  {
    name: "add_label_to_card",
    description: "Add an existing label to a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card",
        },
        labelId: {
          type: "string",
          description: "ID of the label to add",
        },
      },
      required: ["cardId", "labelId"],
    },
  },
  {
    name: "remove_label_from_card",
    description: "Remove a label from a card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card",
        },
        labelId: {
          type: "string",
          description: "ID of the label to remove",
        },
      },
      required: ["cardId", "labelId"],
    },
  },
  {
    name: "get-boards",
    description: "Get all open Trello boards for the authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get-lists",
    description: "Get all open lists on a specific Trello board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to get lists from",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "create-card",
    description: "Create a new card in a specific list on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "ID of the list to create the card in",
        },
        name: {
          type: "string",
          description: "Name of the card",
        },
        desc: {
          type: "string",
          description: "Description of the card (optional)",
        },
      },
      required: ["listId", "name"],
    },
  },
  {
    name: "create-cards",
    description:
      "Create multiple cards in one or more lists on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        cards: {
          type: "array",
          description: "Array of card objects to create",
          items: {
            type: "object",
            properties: {
              listId: {
                type: "string",
                description: "ID of the list to create the card in",
              },
              name: {
                type: "string",
                description: "Name of the card",
              },
              desc: {
                type: "string",
                description: "Description of the card (optional)",
              },
            },
            required: ["listId", "name"],
          },
        },
      },
      required: ["cards"],
    },
  },
  {
    name: "move-card",
    description: "Move a card to a different list on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to move",
        },
        listId: {
          type: "string",
          description: "ID of the target list",
        },
      },
      required: ["cardId", "listId"],
    },
  },
  {
    name: "move-cards",
    description: "Move multiple cards to different lists on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        moves: {
          type: "array",
          description: "Array of move operations",
          items: {
            type: "object",
            properties: {
              cardId: {
                type: "string",
                description: "ID of the card to move",
              },
              listId: {
                type: "string",
                description: "ID of the target list",
              },
            },
            required: ["cardId", "listId"],
          },
        },
      },
      required: ["moves"],
    },
  },
  {
    name: "add-comment",
    description: "Add a comment to a Trello card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to add a comment to",
        },
        text: {
          type: "string",
          description: "Comment text",
        },
      },
      required: ["cardId", "text"],
    },
  },
  {
    name: "add-comments",
    description: "Add comments to multiple Trello cards",
    inputSchema: {
      type: "object",
      properties: {
        comments: {
          type: "array",
          description: "Array of comment objects to add",
          items: {
            type: "object",
            properties: {
              cardId: {
                type: "string",
                description: "ID of the card to add a comment to",
              },
              text: {
                type: "string",
                description: "Comment text",
              },
            },
            required: ["cardId", "text"],
          },
        },
      },
      required: ["comments"],
    },
  },
  {
    name: "create-label",
    description: "Create a new label on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "ID of the board to create the label on",
        },
        name: {
          type: "string",
          description: "Name of the label",
        },
        color: {
          type: "string",
          description:
            "Color of the label. One of: yellow, purple, blue, red, green, orange, black, sky, pink, lime. Omit for no color.",
        },
      },
      required: ["boardId", "name"],
    },
  },
  {
    name: "create-labels",
    description: "Create multiple labels on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        labels: {
          type: "array",
          description: "Array of label objects to create",
          items: {
            type: "object",
            properties: {
              boardId: {
                type: "string",
                description: "ID of the board to create the label on",
              },
              name: {
                type: "string",
                description: "Name of the label",
              },
              color: {
                type: "string",
                description:
                  "Color of the label. One of: yellow, purple, blue, red, green, orange, black, sky, pink, lime. Omit for no color.",
              },
            },
            required: ["boardId", "name"],
          },
        },
      },
      required: ["labels"],
    },
  },
  {
    name: "add-label",
    description: "Add an existing label to a Trello card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card",
        },
        labelId: {
          type: "string",
          description: "ID of the label to add",
        },
      },
      required: ["cardId", "labelId"],
    },
  },
  {
    name: "add-labels",
    description: "Add multiple labels to one or more Trello cards",
    inputSchema: {
      type: "object",
      properties: {
        assignments: {
          type: "array",
          description: "Array of card-label assignments",
          items: {
            type: "object",
            properties: {
              cardId: {
                type: "string",
                description: "ID of the card",
              },
              labelId: {
                type: "string",
                description: "ID of the label to add",
              },
            },
            required: ["cardId", "labelId"],
          },
        },
      },
      required: ["assignments"],
    },
  },
  {
    name: "get-tickets-by-list",
    description:
      "Get all cards (tickets) in a specific list on a Trello board",
    inputSchema: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "ID of the list to get cards from",
        },
      },
      required: ["listId"],
    },
  },
  {
    name: "archive-card",
    description: "Archive (close) a Trello card",
    inputSchema: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "ID of the card to archive",
        },
      },
      required: ["cardId"],
    },
  },
  {
    name: "archive-cards",
    description: "Archive (close) multiple Trello cards",
    inputSchema: {
      type: "object",
      properties: {
        cardIds: {
          type: "array",
          description: "Array of card IDs to archive",
          items: {
            type: "string",
            description: "ID of a card to archive",
          },
        },
      },
      required: ["cardIds"],
    },
  },
];
