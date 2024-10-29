import Carousel from "react-bootstrap/Carousel";

function ReactCarousel({ images, showArrows }) {
  if (images.length === 0)
    images = [
      {
        url: "https://www.portneufbendcampground.com/images/49fef6fa-3550-4e19-bd4c-2343376d47da.webp",
        filename: "",
        _id: "1",
      },
    ];
  return (
    <>
      <Carousel controls={showArrows} data-bs-theme="dark">
        <Carousel.Item
          key={images[0]._id}
          style={{ height: "500px", width: "100%" }}
        >
          <img
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
            src={images[0].url}
            alt="First slide"
          />
        </Carousel.Item>
        {images.slice(1).map((img) => (
          <Carousel.Item
            key={img._id}
            style={{ height: "500px", width: "100%" }}
          >
            <img
              className={`d-block w-100`}
              style={{
                minHeight: "100%",
                minWidth: "100%",
                objectFit: "cover",
              }}
              src={img.url}
              alt="image"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default ReactCarousel;
