using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using iTextSharp.text;
using iTextSharp.text.pdf;
using pdf = iTextSharp.text.pdf;
using System.IO;
using Sandip.DAL;
using iTextSharp.text.html.simpleparser;
using System.Net.Http.Headers;
using System.Text;

namespace Sandip.Controllers
{
    public class GeneratePDFController : ApiController
    {
        public static string footer = "Document Footer";
        public static string headerTitle = "Document Header By Palash";
        [Route("api/GeneratePDF")]
        [HttpGet]
        public HttpResponseMessage GetUsers(int UserId)
        {

            //var stream = CreatePdf();

            //return new HttpResponseMessage
            //{
            //    Content = new StreamContent(stream)
            //    {
            //        Headers =
            //{
            //    ContentType = new MediaTypeHeaderValue("application/pdf"),
            //    ContentDisposition = new ContentDispositionHeaderValue("attachment")
            //    {
            //        FileName = "myfile.pdf"
            //    }
            //}
            //    },
            //    StatusCode = HttpStatusCode.OK
            //};


            var tablecontentHeader = "";
            var tablecontentHeader2 = "";
            var url = "";
            var tablecontent = "<table border='1' style='font-size:10px;'><tr align='center'><td colspan='3'><b>CRM গাড়ির তালিকা Report Creation</b></td></tr><tr syle='aling:center'><td align='center' width='10%'>SL</td> <td align='center'>Perticulars</td><td align='center'>Amount $</td></tr>";
            tablecontent = tablecontent + "<tr><td align='center'>1</td><td>Cycle stand</td><td align='center'> Palash Kanti Bachar test image: </td></tr>";

            tablecontent = tablecontent + "</table>";

            var tablecontentFooter = "<br/><br/><table style='font-size:11px;'>";
            tablecontentFooter = tablecontentFooter + "<tr ><td align='left'>..........................<br/>গাড়ির তালিকা</td><td align='right'>.......................<br/>Accountant</td></tr>";
            tablecontentFooter = tablecontentFooter + "</table><br/><br/>";
            var PrintContent = tablecontentHeader + tablecontent + tablecontentFooter + tablecontentHeader2 +
            tablecontent + tablecontentFooter;

            PrintContent = PrintContent + PrintContent + PrintContent + PrintContent;
            Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
            HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
            //HTMLWorker.ParseToList(new StreamReader("htmlpath.html", Encoding.UTF8));
            ///////////////////////////////////////////////////////////////////////
            BaseFont bfComic = BaseFont.CreateFont("c:\\windows\\fonts\\kalpurush ANSI.ttf", "", BaseFont.NOT_EMBEDDED);
            iTextSharp.text.Font f = new iTextSharp.text.Font(bfComic, 12);
            //pdfDoc.Add(new Paragraph("গাড়ির তালিকা Test call", f));

            //FontFactory.Register("c:\\windows\\fonts\\kalpurush ANSI.ttf", "kalpurushANSI");
            //iTextSharp.text.html.simpleparser.StyleSheet ST = new iTextSharp.text.html.simpleparser.StyleSheet();
            //ST.LoadTagStyle("body", "encoding", "Identity-H");
            // htmlparser.SetStyleSheet = [ST];
            //////////////////////////////////////////////////////

            StringReader sr = new StringReader(PrintContent.ToString());
            MemoryStream memoryStream = new MemoryStream();
            //  using (MemoryStream memoryStream = new MemoryStream())
            // {
            PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
            pdfDoc.Open();
            pdfDoc.Add(new Paragraph("গাড়ির তালিকা Test call", f));
            htmlparser.Parse(sr);
            pdfDoc.Close();

            byte[] bytes = memoryStream.ToArray();
            MemoryStream stream = new MemoryStream(bytes);
            memoryStream.Close();
            HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new StreamContent(stream);
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = "bal.pdf";
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
            //httpResponseMessage.Dispose();
            //Response.End()
            return httpResponseMessage;
        }


        private Stream CreatePdf()
        {
            using (var document = new Document(PageSize.A4, 50, 50, 25, 25))
            {
                var output = new MemoryStream();

                var writer = PdfWriter.GetInstance(document, output);
                writer.CloseStream = false;

                document.Open();
                document.Add(new Paragraph("Hello World"));
                document.Close();

                output.Seek(0, SeekOrigin.Begin);

                return output;
            }
        }

        //public HttpResponseMessage Get(string data)
        //{
        //    var stream = new FileStream(destPath, FileMode.Open, FileAccess.Read);
        //    MemoryStream responseStream = new MemoryStream();
        //    fileStream.Position = 0;
        //    stream.CopyTo(responseStream);
        //    responseStream.Position = 0;
        //    response1.StatusCode = HttpStatusCode.OK;
        //    response1.Content = new StreamContent(responseStream);
        //    byte[] fileData = responseStream.ToArray();
        //    response1.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
        //    string contentDisposition = string.Concat("inline; filename=", fileInfo.FileName);
        //    response1.Content.Headers.Add("x-filename", fileInfo.FileName);
        //    response1.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
        //    response1.Content.Headers.ContentDisposition.FileName = fileInfo.FileName;
        //    response1.Content.Headers.ContentLength = fileStream.Length;
        //    return response1;
        //}


        public class PDFFooter : PdfPageEventHelper
        {
            PdfTemplate headerTemplate, footerTemplate;
            BaseFont bf = null;
            PdfContentByte cb;
            //// write on top of document
            //public override void OnOpenDocument(PdfWriter writer, Document document)
            //{
            //    base.OnOpenDocument(writer, document);

            //    Rectangle page = document.PageSize;
            //    String path = "https://connect.r-o.com/prequal/PublishingImages/er_header.png";
            //    // Step 2 - create two column table;
            //    PdfPTable head = new PdfPTable(1);
            //    head.TotalWidth = page.Width / 5;


            //    // add header image; PdfPCell() overload sizes image to fit cell
            //    PdfPCell imghead = new PdfPCell(iTextSharp.text.Image.GetInstance(path), true);
            //    imghead.HorizontalAlignment = Element.ALIGN_LEFT;
            //    imghead.Border = Rectangle.NO_BORDER;
            //    head.AddCell(imghead);

            //    // write (write) table to PDF document;
            //    // WriteSelectedRows() requires you to specify absolute position!

            //    head.WriteSelectedRows(0, -1, 50, document.Top, writer.DirectContent);

            //}

            //// write on start of each page
            //public override void OnStartPage(PdfWriter writer, Document document)
            //{
            //    base.OnStartPage(writer, document);
            //}

           


        }
    }
}
