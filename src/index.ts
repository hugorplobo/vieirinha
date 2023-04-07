import dotenv from "dotenv";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { Vieirinha } from "./utils/types";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const token = process.env.TOKEN!;
const client: Client & { commands?: Collection<string, { data: any, execute: any }> } 
  = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command: { data: any, execute: any } = require(filePath);

  if (command.data && command.execute) {
    client.commands.set(command.data.name, command!);
  } else {
    console.log(`[WARNING] O comando em ${filePath} não possui as propriedades "data" e "execute".`);
  }
}

client.once(Events.ClientReady, client => {
  console.log("Vieirinha está online! 😎");
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const client: Vieirinha = interaction.client;
  const command = client.commands?.get(interaction.commandName);

  if (!command) {
    console.error(`Nenhum comando "${interaction.commandName}" foi encontrado!`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "Houve um problema ao executar esse comando!", ephemeral: true });
		} else {
			await interaction.reply({ content: "Houve um problema ao executar esse comando!", ephemeral: true });
		}
  }
});

client.login(token);
