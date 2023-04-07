import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Respondo com pong!"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("**:ping_pong: | Pong!**");
  }
}