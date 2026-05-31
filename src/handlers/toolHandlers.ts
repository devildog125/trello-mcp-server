import { TrelloApi } from "../api/trelloApi";

export function createToolHandlers(trello: TrelloApi) {
  return {
    async handleListBoards() {
      try {
        const boards = await trello.get("/members/me/boards", {
          fields: "id,name,closed",
        });
        const openBoards = boards.filter((board: any) => !board.closed);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                openBoards.map((board: any) => ({
                  id: board.id,
                  name: board.name,
                  description: `Trello board: ${board.name}`,
                })),
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleReadBoard(args: any) {
      try {
        console.error("handleReadBoard args:", args);
        const { boardId } = args;
        if (!args || typeof args !== "object" || !args.boardId)
          throw new Error("boardId is required");
        const boardData = await trello.get(`/boards/${boardId}`, {
          fields: "id,name,closed",
        });
        if (boardData.closed) throw new Error("Board is closed");
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
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  boardId: boardData.id,
                  boardName: boardData.name,
                  lists: listWithCards,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleCreateList(args: any) {
      try {
        const { boardId, name } = args;
        if (!boardId || !name) throw new Error("boardId and name are required");
        const list = await trello.createList(boardId as string, name as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: list.id,
                  name: list.name,
                  boardId: list.idBoard,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleCreateCard(args: any) {
      try {
        const { listId, name, desc = "" } = args;
        if (!listId || !name) throw new Error("listId and name are required");
        const card = await trello.post("/cards", {
          idList: listId,
          name,
          desc,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: card.id,
                  url: card.url,
                  name: card.name,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleMoveCard(args: any) {
      try {
        const { cardId, listId } = args;
        if (!cardId || !listId)
          throw new Error("cardId and listId are required");
        await trello.put(`/cards/${cardId}`, { idList: listId });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ moved: true, cardId, listId }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleAddComment(args: any) {
      try {
        const { cardId, text } = args;
        if (!cardId || !text) throw new Error("cardId and text are required");
        const comment = await trello.post(`/cards/${cardId}/actions/comments`, {
          text,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  commentId: comment.id,
                  text: comment.data.text,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleArchiveCard(args: any) {
      try {
        const { cardId } = args;
        if (!cardId) throw new Error("cardId is required");
        await trello.put(`/cards/${cardId}`, { closed: true });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  archived: true,
                  cardId,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleArchiveList(args: any) {
      try {
        const { listId } = args;
        if (!listId) throw new Error("listId is required");

        await trello.put(`/lists/${listId}`, {
          closed: true,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  archived: true,
                  listId,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleDeleteBoard(args: any) {
      try {
        const { boardId } = args;
        if (!boardId) throw new Error("boardId is required");
        await trello.delete(`/boards/${boardId}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  boardId,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleUpdateListName(args: any) {
      try {
        const { listId, name } = args;
        if (!listId || !name) throw new Error("listId and name is required");

        await trello.put(`/lists/${listId}`, { name });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  listId,
                  name,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleUpdateCardName(args: any) {
      try {
        const { cardId, name } = args;
        if (!cardId || !name) throw new Error("cardId and name required");

        await trello.put(`/cards/${cardId}`, { name });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  cardId,
                  name,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleGetCard(args: any) {
      try {
        const { cardId } = args;
        if (!cardId) throw new Error("cardId is required");

        const card = await trello.get(`/cards/${cardId}`, {
          fields: "id,name,desc,idList,idBoard,url,closed",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: card.id,
                  name: card.name,
                  description: card.desc,
                  listId: card.idList,
                  boardId: card.idBoard,
                  url: card.url,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleGetCardComments(args: any) {
      try {
        const { cardId } = args;
        if (!cardId) throw new Error("cardId is required");

        const actions = await trello.get(`/cards/${cardId}/actions`, {
          filter: "commentCard",
        });

        const comments = actions.map((action: any) => ({
          commentId: action.id,
          text: action.data.text,
          author: action.memberCreator?.fullName ?? action.idMemberCreator,
          date: action.date,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(comments, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleUpdateComment(args: any) {
      try {
        const { cardId, commentId, text } = args;
        if (!cardId || !commentId || !text)
          throw new Error("cardId, commentId, and text are required");

        const updated = await trello.put(
          `/cards/${cardId}/actions/${commentId}/comments`,
          { text }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  commentId: updated.id,
                  text: updated.data.text,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleDeleteComment(args: any) {
      try {
        const { cardId, commentId } = args;
        if (!cardId || !commentId)
          throw new Error("cardId and commentId are required");

        await trello.delete(
          `/cards/${cardId}/actions/${commentId}/comments`
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ deleted: true, commentId }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleGetLabels(args: any) {
      try {
        const { boardId } = args;
        if (!boardId) throw new Error("boardId is required");

        const labels = await trello.get(`/boards/${boardId}/labels`, {
          fields: "id,name,color",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                labels.map((l: any) => ({ id: l.id, name: l.name, color: l.color })),
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleCreateLabel(args: any) {
      try {
        const { boardId, name, color } = args;
        if (!boardId || !name) throw new Error("boardId and name are required");

        const label = await trello.post(`/labels`, {
          idBoard: boardId,
          name,
          ...(color ? { color } : {}),
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { id: label.id, name: label.name, color: label.color },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleAddLabelToCard(args: any) {
      try {
        const { cardId, labelId } = args;
        if (!cardId || !labelId) throw new Error("cardId and labelId are required");

        await trello.post(`/cards/${cardId}/idLabels`, { value: labelId });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ added: true, cardId, labelId }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleRemoveLabelFromCard(args: any) {
      try {
        const { cardId, labelId } = args;
        if (!cardId || !labelId) throw new Error("cardId and labelId are required");

        await trello.delete(`/cards/${cardId}/idLabels/${labelId}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ removed: true, cardId, labelId }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleGetLists(args: any) {
      try {
        const { boardId } = args;
        if (!boardId) throw new Error("boardId is required");

        const lists = await trello.get(`/boards/${boardId}/lists`, {
          fields: "id,name,closed",
        });
        const openLists = lists.filter((list: any) => !list.closed);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                openLists.map((list: any) => ({
                  id: list.id,
                  name: list.name,
                })),
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleCreateCards(args: any) {
      try {
        const { cards } = args;
        if (!cards || !Array.isArray(cards) || cards.length === 0)
          throw new Error("cards array is required");

        const results = await Promise.all(
          cards.map(async (card: any) => {
            const { listId, name, desc = "" } = card;
            if (!listId || !name)
              throw new Error("Each card must have listId and name");
            const created = await trello.post("/cards", {
              idList: listId,
              name,
              desc,
            });
            return { id: created.id, url: created.url, name: created.name };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleMoveCards(args: any) {
      try {
        const { moves } = args;
        if (!moves || !Array.isArray(moves) || moves.length === 0)
          throw new Error("moves array is required");

        const results = await Promise.all(
          moves.map(async (move: any) => {
            const { cardId, listId } = move;
            if (!cardId || !listId)
              throw new Error("Each move must have cardId and listId");
            await trello.put(`/cards/${cardId}`, { idList: listId });
            return { moved: true, cardId, listId };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleAddComments(args: any) {
      try {
        const { comments } = args;
        if (!comments || !Array.isArray(comments) || comments.length === 0)
          throw new Error("comments array is required");

        const results = await Promise.all(
          comments.map(async (comment: any) => {
            const { cardId, text } = comment;
            if (!cardId || !text)
              throw new Error("Each comment must have cardId and text");
            const created = await trello.post(
              `/cards/${cardId}/actions/comments`,
              { text }
            );
            return { commentId: created.id, text: created.data.text };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleCreateLabels(args: any) {
      try {
        const { labels } = args;
        if (!labels || !Array.isArray(labels) || labels.length === 0)
          throw new Error("labels array is required");

        const results = await Promise.all(
          labels.map(async (label: any) => {
            const { boardId, name, color } = label;
            if (!boardId || !name)
              throw new Error("Each label must have boardId and name");
            const created = await trello.post(`/labels`, {
              idBoard: boardId,
              name,
              ...(color ? { color } : {}),
            });
            return { id: created.id, name: created.name, color: created.color };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleAddLabels(args: any) {
      try {
        const { assignments } = args;
        if (!assignments || !Array.isArray(assignments) || assignments.length === 0)
          throw new Error("assignments array is required");

        const results = await Promise.all(
          assignments.map(async (assignment: any) => {
            const { cardId, labelId } = assignment;
            if (!cardId || !labelId)
              throw new Error("Each assignment must have cardId and labelId");
            await trello.post(`/cards/${cardId}/idLabels`, { value: labelId });
            return { added: true, cardId, labelId };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleGetTicketsByList(args: any) {
      try {
        const { listId } = args;
        if (!listId) throw new Error("listId is required");

        const cards = await trello.get(`/lists/${listId}/cards`, {
          fields: "id,name,desc,idList,url,closed",
        });
        const openCards = cards.filter((card: any) => !card.closed);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                openCards.map((card: any) => ({
                  id: card.id,
                  name: card.name,
                  description: card.desc,
                  url: card.url,
                })),
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
    async handleArchiveCards(args: any) {
      try {
        const { cardIds } = args;
        if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0)
          throw new Error("cardIds array is required");

        const results = await Promise.all(
          cardIds.map(async (cardId: string) => {
            await trello.put(`/cards/${cardId}`, { closed: true });
            return { archived: true, cardId };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    },
  };
}
