// KODE GOOGLE APPS SCRIPT (UPDATED)
// 1. Pastikan Anda punya 3 Sheet (Tab) di bawah: "Projects", "Stats", "Skills"
// 2. Rename Sheet1 jadi "Projects" (jika belum).
// 3. Buat Sheet baru tombol (+) beri nama "Stats".
// 4. Buat Sheet baru tombol (+) beri nama "Skills".
//
// === STRUKTUR HEADER ===
// Sheet "Projects": id, title, description, image_url, project_url, technologies, created_at, updated_at
// Sheet "Stats":    id, value, label, created_at, updated_at
// Sheet "Skills":   id, title, items, created_at, updated_at

const SHEET_PROJECTS = "Projects";
const SHEET_STATS = "Stats";
const SHEET_SKILLS = "Skills";

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const action = e.parameter.action; // 'read', 'create', 'update', 'delete'
        const type = e.parameter.type;     // 'projects', 'stats', 'skills'  <-- PARAMETER BARU PENTING

        if (!type) return responseJSON({ status: 'error', message: 'Parameter "type" is required (projects, stats, skills)' });

        let sheetName = "";
        if (type === 'projects') sheetName = SHEET_PROJECTS;
        else if (type === 'stats') sheetName = SHEET_STATS;
        else if (type === 'skills') sheetName = SHEET_SKILLS;
        else return responseJSON({ status: 'error', message: 'Invalid type' });

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) return responseJSON({ status: 'error', message: `Sheet "${sheetName}" not found` });

        // --- READ ---
        if (!action || action === 'read') {
            const data = getSheetData(sheet);
            return responseJSON({ status: 'success', data: data });
        }

        // --- WRITE ACTIONS ---
        const payload = JSON.parse(e.postData.contents);
        const timestamp = new Date().toISOString().split('T')[0];

        if (action === 'create') {
            const newId = generateId(sheet);
            let rowData = [];

            if (type === 'projects') {
                rowData = [newId, payload.title, payload.description, payload.image_url, payload.project_url, payload.technologies, timestamp, timestamp];
            } else if (type === 'stats') {
                rowData = [newId, payload.value, payload.label, timestamp, timestamp];
            } else if (type === 'skills') {
                rowData = [newId, payload.title, payload.items, timestamp, timestamp]; // items string newline separated
            }

            sheet.appendRow(rowData);
            return responseJSON({ status: 'success', message: `${type} created`, id: newId });

        } else if (action === 'update') {
            const id = payload.id;
            const rowIndex = findRowIndexById(sheet, id);
            if (rowIndex === -1) return responseJSON({ status: 'error', message: 'ID not found' });

            // Update logic based on type
            if (type === 'projects') {
                // Col 2-6: Title, Desc, Img, Url, Tech
                const range = sheet.getRange(rowIndex, 2, 1, 5);
                range.setValues([[payload.title, payload.description, payload.image_url, payload.project_url, payload.technologies]]);
                sheet.getRange(rowIndex, 8).setValue(timestamp); // Updated At

            } else if (type === 'stats') {
                // Col 2-3: Value, Label
                const range = sheet.getRange(rowIndex, 2, 1, 2);
                range.setValues([[payload.value, payload.label]]);
                sheet.getRange(rowIndex, 5).setValue(timestamp);

            } else if (type === 'skills') {
                // Col 2-3: Title, Items
                const range = sheet.getRange(rowIndex, 2, 1, 2);
                range.setValues([[payload.title, payload.items]]);
                sheet.getRange(rowIndex, 5).setValue(timestamp);
            }

            return responseJSON({ status: 'success', message: `${type} updated` });

        } else if (action === 'delete') {
            const id = payload.id;
            const rowIndex = findRowIndexById(sheet, id);
            if (rowIndex === -1) return responseJSON({ status: 'error', message: 'ID not found' });

            sheet.deleteRow(rowIndex);
            return responseJSON({ status: 'success', message: `${type} deleted` });
        }

    } catch (error) {
        return responseJSON({ status: 'error', message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

// HELPER FUNCTIONS SAME AS BEFORE
function getSheetData(sheet) {
    const rows = sheet.getDataRange().getValues();
    if (rows.length < 2) return []; // Only header or empty
    const headers = rows[0];
    const data = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
        }
        data.push(obj);
    }
    return data;
}

function findRowIndexById(sheet, id) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) return i + 1;
    }
    return -1;
}

function generateId(sheet) {
    const data = sheet.getDataRange().getValues();
    let maxId = 0;
    for (let i = 1; i < data.length; i++) {
        const id = parseInt(data[i][0]);
        if (!isNaN(id) && id > maxId) maxId = id;
    }
    return maxId + 1;
}

function responseJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
