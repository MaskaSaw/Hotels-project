using System;
using System.IO;
using System.Linq;

namespace Hotels.ImageProcessing
{
    public static class ImageProcessor
    {
        private static int imageNameLength = 20;
        private static string folderPath = Path.GetFullPath(@"..\") + "Images";
        public static string SaveImage(string base64string)
        {
            try
            {
                var fileName = GetName();
                var fileExtension = GetExtension(base64string.Substring(0, base64string.IndexOf(",")));
                var bytes = Convert.FromBase64String(base64string.Substring(base64string.IndexOf(",") + 1));
                var filePath = $@"{folderPath}\{fileName}.{fileExtension}";

                using (FileStream fstream = new FileStream(filePath, FileMode.OpenOrCreate))
                {
                    fstream.Write(bytes, 0, bytes.Length);
                }

                return $@"{fileName}\{fileExtension}";
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        public static string GetImage(string fileName)
        {
            try
            {
                var filePath = $@"{folderPath}\{fileName}";
                var imageString = string.Empty;
                using (FileStream fstream = new FileStream(filePath, FileMode.OpenOrCreate))
                {
                    byte[] imageBytes = new byte[fstream.Length];
                    fstream.Read(imageBytes, 0, imageBytes.Length);
                    imageString = @"data:image/" + GetExtension(
                        fileName.Substring(
                            fileName.IndexOf("."), fileName.Length - fileName.IndexOf(".")
                        )
                    ) + ";base64," + Convert.ToBase64String(imageBytes);

                }

                return imageString;
            }
            catch 
            {
                throw;
            }
        }

        public static void DeleteImage(string fileName)
        {
            File.Delete($@"{folderPath}\{fileName}");
        }

        private static string GetName()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            Random random = new Random();

            return new string(Enumerable.Repeat(chars, imageNameLength)
                .Select(s => s[random.Next(s.Length)])
                .ToArray()
            );
        }

        private static string GetExtension(string fileExtensionPart)
        {
            var extension = string.Empty;

            switch (fileExtensionPart)
            {
                case string s when s.Contains("jpeg"):
                    extension = "jpg";
                    break;
                case string s when s.Contains("jpg"):
                    extension = "jpeg";
                    break;
                case string s when s.Contains("png"):
                    extension = "png";
                    break;
                default:
                    throw new InvalidDataException();
            }

            return extension;
        }
    }
}
