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

const enumasies = ['jenisKelamin', 'jenisPekerjaan', 'statusKawin', 'agama', 'pendidikanTerakhir']

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
                    ['KASUS', ':', data.kasus || ''],
                    ['NAMA', ':', data.nama || ''],
                    ['NIK', ':', data.nik || ''],
                    ['NO. KARTU KELUARGA', ':', data.noKartuKeluarga || ''],
                    ['TEMPAT LAHIR', ':', data.tempatLahir || ''],
                    ['TANGGAL LAHIR', ':', data.tanggalLahir || ''],
                    ['JENIS KELAMIN', ':', data.jenisKelamin || ''],
                    ['JENIS PEKERJAAN', ':', data.jenisPekerjaan || ''],
                    ['STATUS KAWIN', ':', data.statusKawin || ''],
                    ['AGAMA', ':', data.agama || ''],
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
      return daysKey;
    }
    const summary = {
      total: data.length,
      perDay: expandDays(data.reduce((acc, cur) => {
        var d = new Date(cur.createdAt).toISOString().slice(0, 10);
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {})),
      jenisPekerjaan: aggregate(data, 'jenisPekerjaan'),
      pendidikanTerakhir: aggregate(data, 'pendidikanTerakhir'),
      jenisKelamin: aggregate(data, 'jenisKelamin'),
      agama: aggregate(data, 'agama'),
      kasus: aggregate(data, 'kasus'),
      kecamatan: aggregate(data, 'kecamatan'),
    };
    return summary;
  },
  async export (ctx) {
    const workbook = new ExcelJS.Workbook();
    const worksheet1 = workbook.addWorksheet('Data');
    const worksheet2 = workbook.addWorksheet('Opsi');
    worksheet1.columns = [{
      header: 'ID KASUS',
      width: 10,
      key: 'id',
    }, {
      header: 'NIK',
      width: 20,
      key: 'nik',
    }, {
      header: 'Kasus',
      width: 20,
      key: 'kasus',
    }, {
      header: 'Nama Alias',
      width: 20,
      key: 'namaAlias',
    }, {
      header: 'Nama Lengkap',
      width: 20,
      key: 'nama',
    }, {
      header: 'No Handphone',
      width: 20,
      key: 'noHandphone',
    }, {
      header: 'Tempat Lahir',
      width: 20,
      key: 'tempatLahir',
    }, {
      width: 20,
      header: 'Tanggal Lahir',
      key: 'tanggalLahir',
    }, {
      header: 'Jenis Kelamin',
      width: 20,
      key: 'jenisKelamin',
    }, {
      header: 'Jenis Pekerjaan',
      width: 20,
      key: 'jenisPekerjaan',
    }, {
      header: 'Status Kawin',
      width: 20,
      key: 'statusKawin',
    }, {
      header: 'Agama',
      key: 'agama',
      width: 20,
    }, {
      header: 'Pendidikan Terakhir',
      width: 20,
      key: 'pendidikanTerakhir',
    }, {
      header: 'Alamat',
      width: 20,
      key: 'alamat',
    }, {
      header: 'RT/RW',
      width: 20,
      key: 'rtRw',
    }, {
      header: 'Kelurahan',
      width: 20,
      key: 'kelurahan',
    }, {
      header: 'Kecamatan',
      width: 20,
      key: 'kecamatan',
    }, {
      header: 'Kabupaten',
      width: 20,
      key: 'kabupaten',
    }, {
      header: 'Propinsi',
      width: 20,
      key: 'propinsi',
    }, {
      header: 'Nama Ayah',
      width: 20,
      key: 'namaAyah',
    }, {
      header: 'Nama Ibu',
      width: 20,
      key: 'namaIbu',
    }, {
      header: 'NIK Ayah',
      width: 20,
      key: 'nikAyah',
    }, {
      header: 'NIK Ibu',
      width: 20,
      key: 'nikIbu',
    }, {
      header: 'Peran',
      width: 30,
      key: 'peran',
    }, {
      header: 'BAP',
      width: 30,
      key: 'bap',
    }, {
      header: 'Passport',
      width: 30,
      key: 'passport',
    }, {
      header: 'Pendanaan',
      width: 30,
      key: 'pendanaan',
    }, {
      header: 'Informasi Teknis',
      width: 30,
      key: 'informasiTeknis',
    }, {
      header: 'Lapangan',
      width: 30,
      key: 'lapangan',
    }];
    const data = await strapi.db.query('api::matrik.matrik').findMany({
      limit: null,
    });
    worksheet1.addRows(data);
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
    worksheet1.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        newData.push({
          id: row.getCell(1).value,
          nik: row.getCell(2).value,
          kasus: row.getCell(3).value,
          namaAlias: row.getCell(4).value,
          nama: row.getCell(5).value,
          noHandphone: row.getCell(6).value,
          tempatLahir: row.getCell(7).value,
          tanggalLahir: row.getCell(8).value,
          jenisKelamin: row.getCell(9).value,
          jenisPekerjaan: row.getCell(10).value,
          statusKawin: row.getCell(11).value,
          agama: row.getCell(12).value,
          pendidikanTerakhir: row.getCell(13).value,
          alamat: row.getCell(15).value,
          rtRw: row.getCell(16).value,
          kelurahan: row.getCell(17).value,
          kecamatan: row.getCell(18).value,
          kabupaten: row.getCell(19).value,
          propinsi: row.getCell(20).value,
          namaAyah: row.getCell(21).value,
          namaIbu: row.getCell(22).value,
          nikAyah: row.getCell(23).value,
          nikIbu: row.getCell(24).value,
          peran: row.getCell(25).value,
          bap: row.getCell(26).value,
          passport: row.getCell(27).value,
          pendanaan: row.getCell(28).value,
          informasiTeknis: row.getCell(29).value,
          lapangan: row.getCell(30).value,
        });
      }
    });
    const oldData = await strapi.db.query('api::matrik.matrik').findMany({
      limit: null,
    });
    var created = 0,
      updated = 0;
    for (let i = 0; i < newData.length; i++) {
      const newItem = newData[i];
      const oldItem = oldData.find(q => q.id == newItem.id);
      if (oldItem) {
        await strapi.db.query('api::matrik.matrik').update({
          where: {
            id: oldItem.id
          },
          data: newItem
        });
        updated++;
      } else {
        await strapi.db.query('api::matrik.matrik').create({
          data: newItem
        });
        created++;
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
