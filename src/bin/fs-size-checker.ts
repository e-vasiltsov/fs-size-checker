#!/usr/bin/env node

import { AppFactory } from "../factories/app-factory";

const command = AppFactory.createCli();

command.execute();
