const fs = require('fs');

const wikiFolder = `./wiki`;

function log(message, level)
{
    const prefix = '--'.repeat(level);

    console.log(`${prefix} ${message}`);
}

function extractFolderNamesFromContentList(contentList)
{
    return contentList.filter(item => !item.startsWith('.') && !item.endsWith('.md'));
}

function extractMarkdownDocsFromContentList(contentList)
{
    return contentList.filter(item => item.endsWith('.md'));
}

function createFolderMap(folders)
{
    return folders.reduce((folderMap, folderName) => ({ ...folderMap, [folderName]: folderName }), {});
}

// Creates a map of filename -> order index to easily pull and compare order indexes
function createMarkdownOrderMap(path)
{
    const orderFile = `${path}/.order`;
    const order     = fs.existsSync(orderFile) ? fs.readFileSync(orderFile, 'utf8').split('\r\n') : [];
    
    // Reduce to map object and add '.md' to filenames as that's how they will be received from the sort function
    return order.reduce((map, fileName, index) => ({ ...map, [`${fileName}.md`]: index }), {});
}

function generateDirectorySummary(path, level)
{
    path  = path  || '';
    level = level || 0;

    log(`🔍 Scanning ${path}...`, level);

    const scannedPath = `${wikiFolder}/${path}`;
    const contentList = fs.readdirSync(scannedPath);
    const folders     = extractFolderNamesFromContentList(contentList);
    const docs        = extractMarkdownDocsFromContentList(contentList);
    const folderMap   = createFolderMap(folders);
    const order       = createMarkdownOrderMap(scannedPath);

    log(`📃 Found ${docs.length} .md files.`, level);

    return docs.sort((doc1, doc2) => order[doc1] - order[doc2])
               .map(doc =>
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
