const fs = require('fs');

const wikiFolder = `./wiki`;

function log(message, level)
{
    const prefix = '--'.repeat(level);

    console.log(`${prefix} ${message}`);
}

function generateDirectorySummary(path, level)
{
    path  = path  || '';
    level = level || 0;

    log(`🔍 Scanning ${path}...`, level);

    const scannedPath = `${wikiFolder}/${path}`;
    const contentList = fs.readdirSync(scannedPath);
    const folders     = contentList.filter(item => !item.startsWith('.') && !item.endsWith('.md'));
    const docs        = contentList.filter(item => item.endsWith('.md'));
    const folderMap   = folders.reduce((folderMap, folderName) => ({ ...folderMap, [folderName]: folderName }), {});
    
    log(`📃 Found ${docs.length} .md files.`, level);

    return docs.map(doc =>
    {
        const fileName = doc.substring(0, doc.length - 3);

        const description = {
            title: fileName.replace('-', ' '),
            file : `${path}/${doc}`
        };

        if (folderMap[fileName])
        {
            log(`📂 Scanning '${fileName}' childern...`, level);

            const childFolder = `${path}/${fileName}`;

            description.children = generateDirectorySummary(childFolder, level + 1);
        }

        return description;
    });
}

log('------------------------------------------');
log('---- ⚙ Generating new summary.json file ----');
log('------------------------------------------');

const summary     = generateDirectorySummary();
const summaryFile = `${wikiFolder}/summary.json`;

log('Writing generated summary object to file...');

fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

log('------------------------------------------');
log('----- ✔ Generated summary.json file -----');
log('------------------------------------------');
