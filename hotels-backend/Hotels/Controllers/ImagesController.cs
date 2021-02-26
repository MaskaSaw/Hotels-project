using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hotels.ImageProcessing;
using Microsoft.AspNetCore.Http;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly ImageService _imageService;

        public ImagesController(ImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost]
        public async Task<ActionResult<string>> PostImage(IFormFile image)
        {
            var imageName = await _imageService.SaveImageAsync(image);
            var imageFullPath = new Uri($"{Request.Scheme}://{Request.Host}/{imageName}");
            return CreatedAtAction("PostImage", imageFullPath);
        }
    }
}
