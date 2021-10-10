module.exports = async (client) => {
    setInterval(async () => {
        let {
            commands
        } = client

        let categories = []

        let docs = "# OP Bot Command List\n> :heart: Command list generated \n"

        commands.forEach(command => {
            if (!categories.includes(command.category)) {
                categories.push(command.category)
            }
        })

        categories.forEach(cat => {
            const tCommands = commands.filter(cmd => cmd.category === cat)
            docs += `
            \n
### ${cat} [${tCommands.size}] 
| Name | Description | 
| ---- | ----------- | 
${tCommands.map(command => {
    return `| [${command.name}](https://github.com/TajuModding/OP-Bot/tree/main/docs/commands.md#${command.name}) | ${command.description} | `
}).join("\n")}\n\n`
        })

        docs += "# Detailed Command List"

        categories.forEach(cat => {
            const tCommands = commands.filter(cmd => cmd.category === cat)

            docs += `
## ${cat} | ${tCommands.size} Commands
${tCommands.map(command => {
   return `
### ${command.name}
Command: ${command.name}\\
Description: ${command.description}\\
Usage: ${command.usage}
[Back to top](https://github.com/TajuModding/OP-Bot/tree/main/docs/commands.md#OP-Bot-command-list)`
}).join("\n\n")}`
        })



        const fs = require('fs')
        if (fs.existsSync('./docs/commands.md')) {
            fs.writeFileSync('./docs/commands.md', docs.trim())
            console.log("Command list updated!")
        }

    }, 10 * 60 * 1000)

}