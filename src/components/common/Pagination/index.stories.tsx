import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import Pagination from ".";

const meta = {
  title: "Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPagination: Story = {
  args: {
    currentPage: 1,
    count: 100,
    handlePageChange: (pageNumber: number) => {},
  },
};
