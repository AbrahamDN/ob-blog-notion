import "server-only";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const fetchPages = React.cache((pageSize?: number, startCursor?: string) =>
  notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Published",
      },
    },
    page_size: pageSize,
    start_cursor: startCursor,
  })
);

export const fetchBySlug = React.cache((slug: string) =>
  notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Status",
            status: {
              equals: "Published",
            },
          },
        ],
      },
    })
    .then((res) => res.results[0] as PageObjectResponse | undefined)
);

export const fetchPageBlocks = React.cache((pageId: string) =>
  notion.blocks.children
    .list({
      block_id: pageId,
    })
    .then((res) => res.results as BlockObjectResponse[])
);
