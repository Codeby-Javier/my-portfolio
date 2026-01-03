// KODE GOOGLE APPS SCRIPT (UPDATED)
// 1. Pastikan Anda punya 4 Sheet (Tab) di bawah: "Projects", "Stats", "Skills", "Stacks"
// 2. Rename Sheet1 jadi "Projects" (jika belum).
// 3. Buat Sheet baru tombol (+) beri nama "Stats".
// 4. Buat Sheet baru tombol (+) beri nama "Skills".
// 5. Buat Sheet baru tombol (+) beri nama "Stacks".
//
// === STRUKTUR HEADER ===
// Sheet "Projects": id, title, description, image_url, project_url, technologies, created_at, updated_at
// Sheet "Stats":    id, value, label, created_at, updated_at
// Sheet "Skills":   id, title, items, created_at, updated_at
// Sheet "Stacks":   id, project_id, stack_name, color, created_at, updated_at
//
// CATATAN: Kolom "color" di Stacks akan otomatis diambil dari warna background cell di kolom stack_name

const SHEET_PROJECTS = "Projects";
const SHEET_STATS = "Stats";
const SHEET_SKILLS = "Skills";
const SHEET_STACKS = "Stacks";

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
        const type = e.parameter.type;     // 'projects', 'stats', 'skills', 'stacks'  <-- PARAMETER BARU PENTING

        if (!type) return responseJSON({ status: 'error', message: 'Parameter "type" is required (projects, stats, skills, stacks)' });

        let sheetName = "";
        if (type === 'projects') sheetName = SHEET_PROJECTS;
        else if (type === 'stats') sheetName = SHEET_STATS;
        else if (type === 'skills') sheetName = SHEET_SKILLS;
        else if (type === 'stacks') sheetName = SHEET_STACKS;
        else return responseJSON({ status: 'error', message: 'Invalid type' });

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) return responseJSON({ status: 'error', message: `Sheet "${sheetName}" not found` });

        // --- READ ---
        if (!action || action === 'read') {
            let data;
            
            // Untuk stacks, ambil data dengan warna
            if (type === 'stacks') {
                data = getStacksDataWithColor(sheet);
            } else {
                data = getSheetData(sheet);
            }
            
            // Jika type adalah 'projects', tambahkan stacks untuk setiap project
            if (type === 'projects') {
                const stacksSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STACKS);
                if (stacksSheet) {
                    const stacksData = getStacksDataWithColor(stacksSheet);
                    
                    // Tambahkan stacks ke setiap project
                    data = data.map(project => {
                        const projectStacks = stacksData
                            .filter(stack => {
                                // Konversi ke string untuk perbandingan yang lebih aman
                                const stackProjectId = String(stack.project_id).trim();
                                const projectId = String(project.id).trim();
                                return stackProjectId === projectId;
                            })
                            .map(stack => ({
                                name: stack.stack_name,
                                color: stack.color
                            }));
                        return { ...project, stacks: projectStacks };
                    });
                }
            }
            
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
            } else if (type === 'stacks') {
                rowData = [newId, payload.project_id, payload.stack_name, payload.color || '', timestamp, timestamp];
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
                
            } else if (type === 'stacks') {
                // Col 2-4: Project ID, Stack Name, Color
                const range = sheet.getRange(rowIndex, 2, 1, 3);
                range.setValues([[payload.project_id, payload.stack_name, payload.color || '']]);
                sheet.getRange(rowIndex, 6).setValue(timestamp);
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
        // Skip baris kosong (cek jika semua kolom kosong)
        const isEmptyRow = row.every(cell => cell === '' || cell === null || cell === undefined);
        if (isEmptyRow) continue;
        
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

// Fungsi khusus untuk membaca data Stacks dengan warna dari cell
function getStacksDataWithColor(sheet) {
    const rows = sheet.getDataRange().getValues();
    if (rows.length < 2) return [];
    
    const headers = rows[0];
    const data = [];
    
    // Cari index kolom stack_name
    const stackNameIndex = headers.indexOf('stack_name');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip baris kosong
        const isEmptyRow = row.every(cell => cell === '' || cell === null || cell === undefined);
        if (isEmptyRow) continue;
        
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
        }
        
        // Ambil warna background dari cell stack_name
        if (stackNameIndex !== -1) {
            const cell = sheet.getRange(i + 1, stackNameIndex + 1);
            const bgColor = cell.getBackground();
            obj.color = bgColor;
        }
        
        data.push(obj);
    }
    
    return data;
}
