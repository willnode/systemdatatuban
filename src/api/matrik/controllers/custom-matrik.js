const fonts = {
  'Roboto': {
    normal: './public/fonts/times.ttf',
    bold: './public/fonts/timesbd.ttf',
    italics: './public/fonts/timesi.ttf',
    bolditalics: './public/fonts/timesbi.ttf'
  }
}

const formatTglID = (tgl) => new Date(tgl).toLocaleString('id', {
  timeZone: 'Asia/Jakarta',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
}).replace(/\./g, ':');

const fs = require('fs');
const ExcelJS = require('exceljs');
const Schema = require('../content-types/matrik/schema.json');
const kontakTipeEnum = require('../../../components/itemized/item-sosmed.json').attributes.tipe.enum;
const {
  exec,
  execSync
} = require('child_process');
const path = require('path');

const enumasies = ['jenisKelamin', 'jenisPekerjaan', 'statusKawin', 'pendidikanTerakhir']

module.exports = {
  async print(ctx) {
    const {
      id
    } = ctx.params;

    function image(x, fit = {
      fit: [150, 150]
    }) {
      return {
        alignment: 'center',
        image: './public' + (x ? x.url : '/placeholder.png'),
        ...fit,
      };
    }

    const data = await strapi.db.query('api::matrik.matrik').findOne({
      where: {
        id
      },
      populate: {
        pasFoto: true,
        keluarga: true,
        pendanaanDokumentasi: true,
        mediaSosial: true,
        mediaSosialDokumentasi: true,
        pendanaanDokumentasi: true,
        lapanganDokumentasi: true,
      },
    });

    if (!data) {
      return ctx.badRequest(null, [
        strapi.services.errors.generateError(
          'NotFound',
          'No record has been found for this query.'
        )
      ]);
    }


    var dd = {
      pageSize: 'A4',
      content: [{
          text: "MATRIKS",
          style: 'header',
        },
        {
          table: {
            widths: [100, 100, 150, 100],
            headerRows: 0,
            body: [
              [{
                fillColor: 'green',
                stack: [{
                  text: "IDENTITAS",
                  margin: 10,
                  alignment: 'center'
                }, {
                  ...image(data.pasFoto, {
                    width: 100
                  }),
                  margin: [0, 0, 0, 20]
                }, {
                  text: "als",
                  margin: 5,
                  alignment: 'center'
                }, {
                  text: data.namaAlias,
                  margin: 5,
                  alignment: 'center'
                }, {
                  text: data.noHandphone,
                  margin: 5,
                  alignment: 'center'
                }, ]
              }, {
                colSpan: 3,
                table: {
                  widths: ['auto', 'auto', '*'],
                  headerRows: 0,
                  body: [
                    ['KELOMPOK', ':', data.kelompok || ''],
                    ['SKALA/STATUS', ':', data.skalaStatus || ''],
                    ['PANTAUAN', ':', data.pantauan || ''],
                    ['NAMA', ':', data.nama || ''],
                    ['NIK', ':', data.nik || ''],
                    ['NO. KARTU KELUARGA', ':', data.noKartuKeluarga || ''],
                    ['TEMPAT LAHIR', ':', data.tempatLahir || ''],
                    ['TANGGAL LAHIR', ':', data.tanggalLahir || ''],
                    ['JENIS KELAMIN', ':', data.jenisKelamin || ''],
                    ['JENIS PEKERJAAN', ':', data.jenisPekerjaan || ''],
                    ['STATUS KAWIN', ':', data.statusKawin || ''],
                    ['PENDIDIKAN TERAKHIR', ':', data.pendidikanTerakhir || ''],
                    ['ALAMAT', ':', data.alamat || ''],
                    ['RT / RW	', ':', data.rtRw || ''],
                    ['KELURAHAN', ':', data.kelurahan || ''],
                    ['KECAMATAN', ':', data.kecamatan || ''],
                    ['KABUPATEN', ':', data.kabupaten || ''],
                    ['PROPINSI', ':', data.propinsi || ''],
                    ['NAMA AYAH', ':', data.namaAyah || ''],
                    ['NIK AYAH', ':', data.nikAyah || ''],
                    ['NAMA IBU', ':', data.namaIbu || ''],
                    ['NIK IBU', ':', data.nikIbu || ''],
                  ]
                },
                layout: 'noBorders'
              }, '', ''],
              [{
                  fillColor: 'green',
                  text: "KELUARGA"
                },
                ["NIK", ...(data.keluarga || []).map(x => x.nik || '')],
                ["NAMA", ...(data.keluarga || []).map(x => x.nama || '')],
                ["NOMOR", ...(data.keluarga || []).map(x => x.nomor || '')]
              ],
              [{
                fillColor: 'green',
                text: "PERAN / KETERLIBATAN"
              }, {
                colSpan: 3,
                text: data.peran || ''
              }, '', ''],
              [{
                fillColor: 'green',
                text: "BAP"
              }, {
                colSpan: 3,
                text: data.bap || ''
              }, '', ''],
              [{
                fillColor: 'green',
                text: "INTEROGASI"
              }, {
                colSpan: 3,
                text: data.interogasi || ''
              }, '', ''],
              [{
                fillColor: 'green',
                text: "PASSPORT"
              }, {
                colSpan: 3,
                text: data.passport || ''
              }, '', ''],
              [{
                fillColor: 'green',
                rowSpan: 2,
                text: "PENDANAAN"
              }, {
                colSpan: 3,
                text: data.pendanaan || ''
              }, '', ''],
              ['', {
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      alignment: 'center',
                      text: "KETERANGAN\n"
                    }],
                    [
                      [({
                        alignment: 'left',
                        text: data.pendanaanKeterangan || ''
                      })]
                    ]
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, {
                colSpan: 2,
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      alignment: 'center',
                      text: "DOKUMENTASI\n"
                    }], ...(data.pendanaanDokumentasi || []).map(x => ([{
                      ...image(x),
                    }]))
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, ''],
              [{
                fillColor: 'green',
                text: "IT"
              }, {
                colSpan: 3,
                text: data.passport || ''
              }, '', ''],
              [{
                fillColor: 'green',
                rowSpan: 2,
                text: "MEDIA SOSIAL"
              }, {
                colSpan: 3,
                table: {
                  widths: ['auto', 'auto', '*'],
                  headerRows: 0,
                  body: [
                    [{
                      colSpan: 3,
                      text: data.noHandphone || ''
                    }, '', ''], ...(data.mediaSosial || []).map(x => ([x.tipe || '', ':', x.value || '']))
                  ]
                },
                layout: 'noBorders',
              }, '', ''],
              ['', {
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      alignment: 'center',
                      text: "KETERANGAN\n"
                    }],
                    [
                      [({
                        alignment: 'left',
                        text: data.mediaSosialKeterangan || ''
                      })]
                    ]
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, {
                colSpan: 2,
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      alignment: 'center',
                      text: "DOKUMENTASI\n"
                    }], ...(data.mediaSosialDokumentasi || []).map(x => ([{
                      ...image(x),
                    }]))
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, ''],
              [{
                rowSpan: 2,
                text: "LAPANGAN",
                fillColor: 'green',
              }, {
                colSpan: 3,
                text: data.lapangan || ''
              }, '', ''],
              ['', {
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      alignment: 'center',
                      text: "KETERANGAN\n"
                    }],
                    [
                      [({
                        alignment: 'left',
                        text: data.lapanganKeterangan || ''
                      })]
                    ]
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, {
                colSpan: 2,
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      alignment: 'center',
                      text: "DOKUMENTASI\n"
                    }], ...(data.lapanganDokumentasi || []).map(x => ([{
                      ...image(x),
                    }]))
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, ''],
            ]
          }
        },
        {
          table: {
            widths: [130, 120, 200],
            headerRows: 0,
            body: [
              ['', 'Dicatat', formatTglID(data.createdAt)],
              ['', 'Diperbarui', formatTglID(data.updatedAt)],
            ],
          },
          layout: 'noBorders'
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center'
        },
        tableHead: {
          bold: true,
        },
        strong: {
          bold: true,
          alignment: 'center',
        },
        notice: {
          bold: true,
          italics: true,
        },
        subheader: {
          italics: true,
          alignment: 'center'
        }
      }
    }


    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    var fs = require('fs');
    const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)
    const filename = `data-${data.nik}-${data.id}-${Math.abs(hashCode(data.nik))}`;
    const rootPath = `./public/matrik-files/${filename}.pdf`;
    if (fs.existsSync(rootPath)) {
      fs.unlinkSync(rootPath);
    }
    const pdfDoc = printer.createPdfKitDocument(dd);
    await new Promise((resolve, reject) => {
      pdfDoc.pipe(fs.createWriteStream(rootPath));
      pdfDoc.once('end', function () {
        resolve(rootPath);
      })
      pdfDoc.once('error', function (e) {
        reject(e);
      })
      pdfDoc.end();
    });
    return ctx.redirect(`/matrik-files/${filename}.pdf` + '?snip=' + new Date().toISOString().replace(/[^\d]/g, ''));
  },
  async summary(ctx) {
    // get monthly summary of data
    const {
      startDate,
      endDate
    } = ctx.request.query;
    const start = new Date(startDate || new Date(Date.now() - 86400000 * 30));
    const end = new Date(endDate || new Date());
    const data = await strapi.db.query('api::matrik.matrik').findMany({
      where: {
        createdAt: {
          $gte: start,
          $lte: end
        },
      },
      limit: null,
    });

    function aggregate(data, key) {
      return data.reduce((acc, cur) => {
        if (cur[key]) {
          acc[cur[key]] = (acc[cur[key]] || 0) + 1;
        }
        return acc;
      }, {});
    }
    var getDaysArray = function (start, end) {
      for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
      }
      return arr;
    };

    function expandDays(data) {
      const days = getDaysArray(start, end);
      const daysKey = {};
      days.forEach(x => {
        var k = x.toISOString().slice(0, 10);
        daysKey[k] = data[k] || 0;
      });
      var daysKeyCount = days.length;
      if (daysKeyCount < 60) return daysKey; // 2 bulan
      // aggregate
      var daysKeyAgg = {};
      var daysKeyAggStep = Math.ceil(daysKeyCount / 30);
      for (var i = 0; i < daysKeyCount; i += daysKeyAggStep) {
        var maxi = Math.min(i + daysKeyAggStep - 1, daysKeyCount - 1);
        var startdate = days[i].toISOString().slice(0, 10);
        var enddate = days[maxi].toISOString().slice(0, 10);
        var datek = `${startdate} s/d ${enddate}`;
        daysKeyAgg[datek] = 0;
        for (let j = i; j <= maxi; j++) {
          daysKeyAgg[datek] += daysKey[days[j].toISOString().slice(0, 10)] || 0;
        }
      }
      return daysKeyAgg;
    }
    const summary = {
      total: data.length,
      perDay: expandDays(data.reduce((acc, cur) => {
        var d = new Date(cur.createdAt).toISOString().slice(0, 10);
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {})),
      jenisPekerjaan: aggregate(data, 'jenisPekerjaan'),
      pantauan: aggregate(data, 'pantauan'),
      jenisKelamin: aggregate(data, 'jenisKelamin'),
      skalaStatus: aggregate(data, 'skalaStatus'),
      kelompok: aggregate(data, 'kelompok'),
      kabupaten: aggregate(data, 'kabupaten'),
    };
    return summary;
  },
  async export (ctx) {
    return ctx.redirect(execSync(`php exporting${path.sep}write.php`).toString('utf8'));
  },
  async exportJSJSJS(ctx) {
    const workbook = new ExcelJS.Workbook();
    const worksheet1 = workbook.addWorksheet('Data');
    const worksheet2 = workbook.addWorksheet('Opsi');
    worksheet1.columns = [{
      header: 'ID KASUS',
      width: 10,
      key: 'id',
      numFmt: '@', // 1
    }, {
      header: 'NIK',
      width: 20,
      key: 'nik',
      numFmt: '@', // 2
    }, {
      header: 'Kelompok',
      width: 20,
      key: 'kelompok',
      numFmt: '@', // 3
    }, {
      header: 'Skala/Status', // 4
      key: 'skalaStatus',
      width: 20,
      numFmt: '@',
    }, {
      header: 'Nama Alias', // 5
      width: 20,
      key: 'namaAlias',
      numFmt: '@',
    }, {
      header: 'Nama Lengkap', // 6
      width: 20,
      key: 'nama',
      numFmt: '@',
    }, {
      header: 'No Handphone', // 7
      width: 20,
      key: 'noHandphone',
      numFmt: '@',
    }, {
      header: 'Tempat Lahir', // 8
      width: 20,
      key: 'tempatLahir',
      numFmt: '@',
    }, {
      width: 20,
      header: 'Tanggal Lahir', // 9
      key: 'tanggalLahir',
      numFmt: '@',
    }, {
      header: 'Jenis Kelamin', // 10
      width: 20,
      key: 'jenisKelamin',
      numFmt: '@',
    }, {
      header: 'Jenis Pekerjaan', // 11
      width: 20,
      key: 'jenisPekerjaan',
      numFmt: '@',
    }, {
      header: 'Status Kawin', // 12
      width: 20,
      key: 'statusKawin',
      numFmt: '@',
    }, {
      header: 'Pendidikan Terakhir', // 13
      width: 20,
      key: 'pendidikanTerakhir',
      numFmt: '@',
    }, {
      header: 'Alamat', // 14
      width: 20,
      key: 'alamat',
      numFmt: '@',
    }, {
      header: 'RT/RW', // 15
      width: 20,
      key: 'rtRw',
      numFmt: '@',
    }, {
      header: 'Kelurahan', // 16
      width: 20,
      key: 'kelurahan',
      numFmt: '@',
    }, {
      header: 'Kecamatan', // 17
      width: 20,
      key: 'kecamatan',
      numFmt: '@',
    }, {
      header: 'Kabupaten', // 18
      width: 20,
      key: 'kabupaten',
      numFmt: '@',
    }, {
      header: 'Propinsi', // 19
      width: 20,
      key: 'propinsi',
      numFmt: '@',
    }, {
      header: 'Nama Ayah', // 20
      width: 20,
      key: 'namaAyah',
      numFmt: '@',
    }, {
      header: 'Nama Ibu', // 21
      width: 20,
      key: 'namaIbu',
      numFmt: '@',
    }, {
      header: 'NIK Ayah', // 22
      width: 20,
      key: 'nikAyah',
      numFmt: '@',
    }, {
      header: 'NIK Ibu', // 23
      width: 20,
      key: 'nikIbu',
      numFmt: '@',
    }, {
      header: 'Peran', // 24
      width: 30,
      key: 'peran',
      numFmt: '@',
    }, {
      header: 'BAP', // 25
      width: 30,
      key: 'bap',
      numFmt: '@',
    }, {
      header: 'Passport', // 26
      width: 30,
      key: 'passport',
      numFmt: '@',
    }, {
      header: 'Pendanaan', // 27
      width: 30,
      key: 'pendanaan',
      numFmt: '@',
    }, {
      header: 'Informasi Teknis', // 28
      width: 30,
      key: 'informasiTeknis',
      numFmt: '@',
    }, {
      header: 'Lapangan', // 29
      width: 30,
      key: 'lapangan',
      numFmt: '@',
    }];
    const data = await strapi.db.query('api::matrik.matrik').findMany({
      limit: null,
    });
    worksheet1.addRows(data);
    worksheet1.eachRow((row, n) => {
      if (n == 1) return;
      for (const x of [2, 7, 22, 23]) {
        row.getCell(x).value = {
          formula: `="${row.getCell(x).value}"`
        };
      }
      for (const x of [24, 25, 26, 27, 28, 29]) {
        row.getCell(x).value = {
          richText: [{
            text: row.getCell(x).value || ""
          }]
        };
      }
    })
    for (let i = 0; i < enumasies.length; i++) {
      worksheet2.getCell(1, i + 1).value = enumasies[i];
      for (let j = 0; j < Schema.attributes[enumasies[i]].enum.length; j++) {
        const element = Schema.attributes[enumasies[i]].enum[j];
        worksheet2.getCell(j + 2, i + 1).value = element;
      }
      var columnAlphabet = String.fromCharCode(65 + i);
      var validation = {
        type: 'list',
        allowBlank: false,
        formulae: [`'Opsi'!$${columnAlphabet}$2:$${columnAlphabet}$999`],
        showErrorMessage: true,
        errorStyle: 'error',
      }
      worksheet1.getColumn(1 + worksheet1.columns.findIndex(x => x._key == enumasies[i])).eachCell(x => {
        x.dataValidation = validation
      });
    }
    const rootDir = `./public/exports`;
    const rootPath = `./public/exports/data-${new Date().toISOString().replace(/[^\d]/g, '')}.xlsx`;
    if (fs.existsSync(rootDir))
      fs.rmdirSync(rootDir, {
        recursive: true,
        force: true,
      });
    fs.mkdirSync(rootDir, {
      recursive: true,
    });
    await workbook.xlsx.writeFile(rootPath);
    // await zipdir(rootPath, {
    //   saveTo: `${rootPath}/tryout-${tryout.slug}.zip`
    // });
    return ctx.redirect(rootPath.substring('./public'.length));
  },
  async import(ctx) {
    if (!ctx.request.files || !ctx.request.files.data) {
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Import</title>
      </head>
      <body>
      <form id="form" method="post" enctype="multipart/form-data">
        Silahkan pilih file excel yang akan di import:<br>
        <input id="input" type="file" name="data" />
        </form><script>
        document.getElementById('input').onchange = function() {
          document.getElementById('form').submit();
        };
        window.onload = function() {
          document.getElementById('input').focus();
          document.getElementById('input').click();
        };
        </script>
        </body>
        </html>`;
    }
    const {
      path,
      name,
      type
    } = ctx.request.files.data;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    const worksheet1 = workbook.getWorksheet('Data');
    const newData = [];
    function expandComponent(value, keys) {
      value = (value || '').trim();
      if (!value) return [];
      var rows = value.split('\n');
      var result = [];
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i].split(';');
        var obj = {};
        for (var j = 0; j < Math.min(keys.length, row.length); j++) {
          obj[keys[j]] = row[j].trim();
        }
        result.push(obj);
      }
      return result;
    }
    function matchEnumSensitivy(value, keys = []) {
      if (keys.includes(value)) return value;
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() == value.toLowerCase()) return keys[i];
      }
      return null;
    }
    var mediaSosialKeys = ['tipe', 'value'];
    var keluargaKeys = ['nik', 'nama', 'nomor'];
    var jenisKelaminEnum = Schema.attributes.jenisKelamin.enum;
    var jenisPekerjaanEnum = Schema.attributes.jenisPekerjaan.enum;
    var statusKawinEnum = Schema.attributes.statusKawin.enum;
    var pendidikanTerakhirEnum = Schema.attributes.pendidikanTerakhir.enum;
    worksheet1.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        newData.push({
          id: row.getCell(1).value?.toString(),
          nik: row.getCell(2).value?.toString(),
          kelompok: row.getCell(3).value?.toString(),
          skalaStatus: row.getCell(4).value?.toString(),
          pantauan: row.getCell(5).value?.toString(),
          namaAlias: row.getCell(6).value?.toString(),
          nama: row.getCell(7).value?.toString(),
          noHandphone: row.getCell(8).value?.toString(),
          noKartuKeluarga: row.getCell(9).value?.toString(),
          tempatLahir: row.getCell(10).value?.toString(),
          tanggalLahir: row.getCell(11).value?.toString(),
          jenisKelamin: matchEnumSensitivy(row.getCell(12).value?.toString(), jenisKelaminEnum),
          jenisPekerjaan:  matchEnumSensitivy(row.getCell(13).value?.toString(), jenisPekerjaanEnum),
          statusKawin: matchEnumSensitivy(row.getCell(14).value?.toString(), statusKawinEnum),
          pendidikanTerakhir: matchEnumSensitivy(row.getCell(15).value?.toString(), pendidikanTerakhirEnum),
          alamat: row.getCell(16).value?.toString(),
          rtRw: row.getCell(17).value?.toString(),
          kelurahan: row.getCell(18).value?.toString(),
          kecamatan: row.getCell(19).value?.toString(),
          kabupaten: row.getCell(20).value?.toString(),
          propinsi: row.getCell(21).value?.toString(),
          namaAyah: row.getCell(22).value?.toString(),
          namaIbu: row.getCell(23).value?.toString(),
          nikAyah: row.getCell(24).value?.toString(),
          nikIbu: row.getCell(25).value?.toString(),
          keluarga: expandComponent(row.getCell(26).value?.toString(), keluargaKeys),
          peran: row.getCell(27).value?.toString(),
          bap: row.getCell(28).value?.toString(),
          interogasi: row.getCell(29).value?.toString(),
          passport: row.getCell(30).value?.toString(),
          informasiTeknis: row.getCell(31).value?.toString(),
          pendanaan: row.getCell(32).value?.toString(),
          pendanaanKeterangan: row.getCell(33).value?.toString(),
          lapangan: row.getCell(34).value?.toString(),
          lapanganKeterangan: row.getCell(35).value?.toString(),
          mediaSosial: expandComponent(row.getCell(36).value?.toString(), mediaSosialKeys).map(x => {
            x.tipe = matchEnumSensitivy(x.tipe, kontakTipeEnum);
            return x;
          }),
          mediaSosialKeterangan: row.getCell(37).value?.toString(),
        });
      }
    });
    const oldData = await strapi.db.query('api::matrik.matrik').findMany({
      limit: null,
    });
    var created = 0,
      updated = 0;
    for (let i = 0; i < newData.length; i++) {
      try {
        const newItem = newData[i];
        const oldItem = oldData.find(q => q.id == newItem.id);
        if (oldItem) {
          await strapi.entityService.update('api::matrik.matrik', oldItem.id, {data: newItem});
          updated++;
        } else {
          await strapi.entityService.create('api::matrik.matrik', {data: newItem});
          created++;
        }
      } catch (error) {
        return {
          info: `Gagal memproses data di baris ${i + 1}`,
          message: error.message,
          data: newData[i]
        };
      }
    }
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Import</title>
    </head>
    <body>
    <script>
    alert('${created} data baru telah ditambahkan, ${updated} data telah diupdate');
    if (window.opener) window.opener.location.reload();
    window.close();
    </script>
    </body>
    `;
  }
}
