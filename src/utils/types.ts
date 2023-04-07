import { Client, Collection } from "discord.js";

export type Vieirinha = Client & { commands?: Collection<string, { data: any, execute: any }> };