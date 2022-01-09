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

module.exports = {
  async print(ctx) {
    const {
      id
    } = ctx.params;

    function image(x, fit = {fit: [150, 150]}) {
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
                  ...image(data.pasFoto, {width: 80}),
                  margin: [10, 0, 10, 20]
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
                    [{alignment: 'center', text:"KETERANGAN\n"}], [[({alignment: 'justify', text:data.pendanaanKeterangan || ''})]]
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, {
                colSpan: 2,
                table: {
                  widths: ['*'],
                  body: [
                    [{alignment: 'center', text:"DOKUMENTASI\n"}], ...(data.pendanaanDokumentasi || []).map(x => ([{
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
                    [{alignment: 'center', text:"KETERANGAN\n"}], [[({alignment: 'justify', text:data.mediaSosialKeterangan || ''})]]
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, {
                colSpan: 2,
                table: {
                  widths: ['*'],
                  body: [
                    [{alignment: 'center', text:"DOKUMENTASI\n"}], ...(data.mediaSosialDokumentasi || []).map(x => ([{
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
                    [{alignment: 'center', text:"KETERANGAN\n"}], [[({alignment: 'justify', text:data.lapanganKeterangan || ''})]]
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, {
                colSpan: 2,
                table: {
                  widths: ['*'],
                  body: [
                    [{alignment: 'center', text:"DOKUMENTASI\n"}], ...(data.lapanganDokumentasi || []).map(x => ([{
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
    return ctx.redirect(`/matrik-files/${filename}.pdf`);
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
    worksheet1.columns = [{
      header: 'NIK',
      key: 'nik',
    }, {
      header: 'Kasus',
      key: 'kasus',
    }, {
      header: 'Nama Alias',
      key: 'namaAlias',
    }, {
      header: 'Nama Lengkap',
      key: 'nama',
    }, {
      header: 'No Handphone',
      key: 'noHandphone',
    }, {
      header: 'Tempat Lahir',
      key: 'tempatLahir',
    }, {
      header: 'Tanggal Lahir',
      key: 'tanggalLahir',
    }, {
      header: 'Jenis Kelamin',
      key: 'jenisKelamin',
    }, {
      header: 'Jenis Pekerjaan',
      key: 'jenisPekerjaan',
    }, {
      header: 'Status Kawin',
      key: 'statusKawin',
    }, {
      header: 'Agama',
      key: 'agama',
    }, {
      header: 'Pendidikan Terakhir',
      key: 'pendidikanTerakhir',
    }, {
      header: 'Alamat',
      key: 'alamat',
    }, {
      header: 'RT/RW',
      key: 'rtRw',
    }, {
      header: 'Kelurahan',
      key: 'kelurahan',
    }, {
      header: 'Kecamatan',
      key: 'kecamatan',
    }, {
      header: 'Kabupaten',
      key: 'kabupaten',
    }, {
      header: 'Propinsi',
      key: 'propinsi',
    }, {
      header: 'Nama Ayah',
      key: 'namaAyah',
    }, {
      header: 'Nama Ibu',
      key: 'namaIbu',
    }, {
      header: 'NIK Ayah',
      key: 'nikAyah',
    }, {
      header: 'NIK Ibu',
      key: 'nikIbu',
    }, {
      header: 'Peran',
      key: 'peran',
    }, {
      header: 'BAP',
      key: 'bap',
    }, {
      header: 'Passport',
      key: 'passport',
    }, {
      header: 'Pendanaan',
      key: 'pendanaan',
    }, {
      header: 'Informasi Teknis',
      key: 'informasiTeknis',
    }, {
      header: 'Lapangan',
      key: 'lapangan',
    }];
    const data = await strapi.db.query('api::matrik.matrik').findMany({
      limit: null,
    });
    worksheet1.addRows(data);
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

  }
}
