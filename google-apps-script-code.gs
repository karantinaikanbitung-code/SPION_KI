/**
 * Google Apps Script untuk menyimpan data ke Google Sheets
 * 
 * INSTRUKSI SETUP:
 * 1. Buka https://script.google.com
 * 2. Buat project baru
 * 3. Copy paste kode ini ke editor
 * 4. Ganti SPREADSHEET_ID dengan ID spreadsheet Anda
 * 5. Deploy sebagai Web App dengan akses "Anyone" atau "Anyone with Google account"
 * 6. Copy URL Web App dan paste ke google-sheets-config.js
 */

// GANTI INI DENGAN ID SPREADSHEET ANDA
// Dapatkan dari URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Mapping nama sheet
const SHEET_NAMES = {
  'Ikan_Segar': 'Ikan Segar',
  'Kepiting': 'Kepiting',
  'Gurita': 'Gurita',
  'Kerang': 'Kerang'
};

/**
 * Fungsi utama untuk menerima POST request
 */
function doPost(e) {
  try {
    let data;
    
    // Coba parse sebagai JSON terlebih dahulu
    try {
      data = JSON.parse(e.postData.contents);
    } catch (jsonError) {
      // Jika bukan JSON, coba parse sebagai URL-encoded
      const params = e.parameter;
      data = {
        action: params.action,
        sheetName: params.sheetName,
        data: JSON.parse(params.data || '[]')
      };
    }
    
    const action = data.action;
    const sheetName = data.sheetName;
    const rowData = data.data;
    
    if (action === 'appendRow') {
      return appendRowToSheet(sheetName, rowData);
    } else if (action === 'saveFileToDrive') {
      return saveFileToDrive(data.filename, data.htmlContent);
    } else {
      return createJSONResponse({
        success: false,
        message: 'Action tidak dikenali'
      });
    }
  } catch (error) {
    return createJSONResponse({
      success: false,
      message: 'Error: ' + error.toString()
    });
  }
}

/**
 * Fungsi untuk menyimpan file HTML ke Google Drive
 */
function saveFileToDrive(filename, htmlContent) {
  try {
    const folderName = 'SPION_LHU_Backups';
    let folder;
    const folders = DriveApp.getFoldersByName(folderName);
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    const file = folder.createFile(filename, htmlContent, MimeType.HTML);
    
    return createJSONResponse({
      success: true,
      message: 'File berhasil disimpan di Google Drive: ' + folderName,
      fileUrl: file.getUrl()
    });
  } catch (error) {
    return createJSONResponse({
      success: false,
      message: 'Gagal simpan ke Drive: ' + error.toString()
    });
  }
}

/**
 * Fungsi untuk menerima GET request (untuk metode alternatif)
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    const sheetName = params.sheetName;
    let rowData;
    
    try {
      rowData = JSON.parse(params.data || '[]');
    } catch (parseError) {
      rowData = [];
    }
    
    if (action === 'appendRow') {
      const result = appendRowToSheetInternal(sheetName, rowData);
      return createJSONResponse(result);
    } else {
      return createJSONResponse({
        success: false,
        message: 'Action tidak dikenali'
      });
    }
  } catch (error) {
    return createJSONResponse({
      success: false,
      message: 'Error: ' + error.toString()
    });
  }
}

/**
 * Membuat JSON response dengan CORS headers
 */
function createJSONResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Menambahkan baris ke sheet (wrapper untuk doPost/doGet)
 */
function appendRowToSheet(sheetName, rowData) {
  const result = appendRowToSheetInternal(sheetName, rowData);
  return createJSONResponse(result);
}

/**
 * Menambahkan baris ke sheet (internal function)
 */
function appendRowToSheetInternal(sheetName, rowData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Cari atau buat sheet berdasarkan nama
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      // Buat sheet baru jika belum ada
      sheet = spreadsheet.insertSheet(sheetName);
      
      // Tambahkan header berdasarkan jenis sheet
      const headers = getHeadersForSheet(sheetName);
      sheet.appendRow(headers);
      
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
    }
    
    // Pastikan header ada
    if (sheet.getLastRow() === 0) {
      const headers = getHeadersForSheet(sheetName);
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
    }
    
    // Tambahkan data
    sheet.appendRow(rowData);
    
    // Format baris baru (opsional)
    const lastRow = sheet.getLastRow();
    const dataRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    dataRange.setHorizontalAlignment('left');
    dataRange.setVerticalAlignment('middle');
    
    // Auto-resize columns
    try {
      sheet.autoResizeColumns(1, rowData.length);
    } catch (resizeError) {
      // Ignore resize errors
    }
    
    return {
      success: true,
      message: 'Data berhasil disimpan',
      row: lastRow
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.toString()
    };
  }
}

/**
 * Mendapatkan header untuk sheet berdasarkan nama
 */
function getHeadersForSheet(sheetName) {
  if (sheetName === 'Ikan_Segar' || sheetName === 'Ikan Segar') {
    return [
      'Waktu Pengisian',
      'Jenis Uji',
      'Jenis Hewan',
      'Tanggal Uji',
      'Nama Panelis',
      'No. Sampel',
      'Kode Contoh Uji',
      'Tanggal Diterima',
      'Kode Contoh 1 - Total',
      'Kode Contoh 1 - Rata-rata',
      'Kode Contoh 1 - Detail Nilai',
      'Kode Contoh 2 - Total',
      'Kode Contoh 2 - Rata-rata',
      'Kode Contoh 2 - Detail Nilai',
      'Kode Contoh 3 - Total',
      'Kode Contoh 3 - Rata-rata',
      'Kode Contoh 3 - Detail Nilai',
      'Kode Contoh 4 - Total',
      'Kode Contoh 4 - Rata-rata',
      'Kode Contoh 4 - Detail Nilai',
      'Kode Contoh 5 - Total',
      'Kode Contoh 5 - Rata-rata',
      'Kode Contoh 5 - Detail Nilai',
      'Kode Contoh 6 - Total',
      'Kode Contoh 6 - Rata-rata',
      'Kode Contoh 6 - Detail Nilai',
      'Catatan'
    ];
  } else if (sheetName === 'Ikan_Beku' || sheetName === 'Ikan Beku') {
    return [
      'Waktu Pengisian',
      'Jenis Uji',
      'Jenis Hewan',
      'Tanggal Uji',
      'Nama Panelis',
      'No. Sampel',
      'Nama Panelis',
      'Tanggal Panelis',
      'Kode Contoh 1 - Total',
      'Kode Contoh 1 - Rata-rata',
      'Kode Contoh 1 - Detail Nilai',
      'Kode Contoh 2 - Total',
      'Kode Contoh 2 - Rata-rata',
      'Kode Contoh 2 - Detail Nilai',
      'Kode Contoh 3 - Total',
      'Kode Contoh 3 - Rata-rata',
      'Kode Contoh 3 - Detail Nilai',
      'Kode Contoh 4 - Total',
      'Kode Contoh 4 - Rata-rata',
      'Kode Contoh 4 - Detail Nilai',
      'Kode Contoh 5 - Total',
      'Kode Contoh 5 - Rata-rata',
      'Kode Contoh 5 - Detail Nilai',
      'Catatan'
    ];
  } else if (sheetName === 'Ikan_Tuna_Kaleng' || sheetName === 'Ikan Tuna Kaleng') {
    return [
      'Waktu Pengisian',
      'Jenis Uji',
      'Jenis Hewan',
      'Tanggal Uji',
      'Nama Panelis',
      'No. Sampel',
      'Nama Panelis',
      'Tanggal Panelis',
      'Kode Contoh 1 - Total',
      'Kode Contoh 1 - Rata-rata',
      'Kode Contoh 1 - Detail Nilai',
      'Kode Contoh 2 - Total',
      'Kode Contoh 2 - Rata-rata',
      'Kode Contoh 2 - Detail Nilai',
      'Kode Contoh 3 - Total',
      'Kode Contoh 3 - Rata-rata',
      'Kode Contoh 3 - Detail Nilai',
      'Kode Contoh 4 - Total',
      'Kode Contoh 4 - Rata-rata',
      'Kode Contoh 4 - Detail Nilai',
      'Kode Contoh 5 - Total',
      'Kode Contoh 5 - Rata-rata',
      'Kode Contoh 5 - Detail Nilai',
      'Catatan'
    ];
  } else {
    // Header untuk jenis hewan lain
    return [
      'Waktu Pengisian',
      'Jenis Uji',
      'Jenis Hewan',
      'Tanggal Uji',
      'Nama Panelis',
      'No. Sampel',
      'Catatan'
    ];
  }
}

/**
 * Fungsi untuk testing (opsional)
 */
function testAppendRow() {
  const testData = [
    new Date().toLocaleString('id-ID'),
    'Uji Organoleptik',
    'Ikan Segar',
    new Date().toISOString().split('T')[0],
    'Test Petugas',
    'TEST001',
    'TEST-CODE-001',
    new Date().toISOString().split('T')[0],
    45, 7.5, 'Row0:9; Row1:7; Row2:5',
    0, 0, '',
    0, 0, '',
    0, 0, '',
    0, 0, '',
    0, 0, '',
    'Test catatan'
  ];
  
  appendRowToSheet('Ikan_Segar', testData);
}

