import type { Meta, StoryObj } from "@storybook/react";
import Input from ".";

const meta = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    value: "Hello, World!",
    disabled: true,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultText: Story = {
  args: {},
};
