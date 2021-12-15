const fonts = {
  'Roboto': {
    normal: './public/fonts/times.ttf',
    bold: './public/fonts/timesbd.ttf',
    italics: './public/fonts/timesi.ttf',
    bolditalics: './public/fonts/timesbi.ttf'
  }
}

module.exports = {
  async print(ctx) {
    const {
      id
    } = ctx.params;

    function image(x, fit = 150) {
      return {
        image: './public' + (x ? x.url : '/placeholder.png'),
        fit: [fit, fit],
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
          text: 'MATRIKS',
          style: 'header',
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            headerRows: 0,
            body: [
              [
                [{
                  text: "IDENTITAS",
                  margin: 10,
                  alignment: 'center'
                }, {
                  //image: './public' + sertifikasi.data_snapshot.dok[0].url,
                  ...image(data.pasFoto, 100),
                  margin: [20, 0, 20, 20]
                }, {
                  text: "als",
                  margin: 5,
                  alignment: 'center'
                }, {
                  text: data.nama,
                  margin: 5,
                  alignment: 'center'
                }, {
                  text: data.noHandphone,
                  margin: 5,
                  alignment: 'center'
                }, ], {
                  colSpan: 3,
                  table: {
                    widths: ['auto', 'auto', '*'],
                    headerRows: 0,
                    body: [
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
                }, '', ''
              ],
              [{
                  text: "KELUARGA"
                },
                ["NIK", ...data.keluarga.map(x => x.nik || '')],
                ["NAMA", ...data.keluarga.map(x => x.nama || '')],
                ["NOMOR", ...data.keluarga.map(x => x.nomor || '')]
              ],
              [{
                text: "PERAN/KETERLIBATAN"
              }, {
                colSpan: 3,
                text: data.peran || ''
              }, '', ''],
              [{
                text: "BAP"
              }, {
                colSpan: 3,
                text: data.bap || ''
              }, '', ''],
              [{
                text: "INTEROGASI"
              }, {
                colSpan: 3,
                text: data.interogasi || ''
              }, '', ''],
              [{
                text: "PASSPORT"
              }, {
                colSpan: 3,
                text: data.passport || ''
              }, '', ''],
              [{
                rowSpan: 2,
                text: "PENDANAAN"
              }, {
                colSpan: 3,
                text: data.pendanaan || ''
              }, '', ''],
              ['', {
                text: data.pendanaanKeterangan || ''
              }, {
                colSpan: 2,
                margin: 10,
                table: {
                  body: [
                    ["DOKUMENTASI\n"], ...data.pendanaanDokumentasi.map(x => ([{
                      ...image(x),
                    }]))
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, ''],
              [{
                text: "IT"
              }, {
                colSpan: 3,
                text: data.passport || ''
              }, '', ''],
              [{
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
                    }, '', ''], ...data.mediaSosial.map(x => ([x.tipe || '', ':', x.value || '']))
                  ]
                },
                layout: 'noBorders',
              }, '', ''],
              ['', {
                text: "KETERANGAN\n" + data.mediaSosialKeterangan || ''
              }, {
                colSpan: 2,
                margin: 10,
                table: {
                  body: [
                    ["DOKUMENTASI\n"], ...(data.mediaSosialDokumentasi || []).map(x => ([{
                      ...image(x),
                    }]))
                  ]
                },
                layout: 'noBorders',
                alignment: 'center'
              }, ''],
              [{
                rowSpan: 2,
                text: "LAPANGAN"
              }, {
                colSpan: 3,
                text: data.lapangan || ''
              }, '', ''],
              ['', {
                text: "KETERANGAN\n" + data.lapanganKeterangan
              }, {
                colSpan: 2,
                margin: 10,
                table: {
                  body: [
                    ["DOKUMENTASI\n"], ...data.lapanganDokumentasi.map(x => ([{
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
    const rootPath = `./public/matrik-files/no-${data.id}.pdf`;
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
    return ctx.redirect('/matrik-files/no-' + data.id + '.pdf');

  }

}
