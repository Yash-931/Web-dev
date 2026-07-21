import { Video } from "@/components/Video";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

export function Landing() {
  return (
    <div className="w-full flex items-center justify-center">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mx-20 mt-3"
      >
        <CarouselContent>
          <CarouselItem className="basis-1/2 lg:basis-1/3">
            <Video url="https://static.higgsfield.ai/claudesfield/main-page/free-mode-banner-supercomputer.webm" />
          </CarouselItem>
          <CarouselItem className="basis-1/2 lg:basis-1/3">
            <Video url="https://cdn.higgsfield.ai/card/9a59ea96-b8be-4602-b527-98b25b65d6cb.mp4" />
          </CarouselItem>
          <CarouselItem className="basis-1/2 lg:basis-1/3">
            <Video url="https://static.higgsfield.ai/claudesfield/main-page/free-mode-banner-supercomputer.webm" />
          </CarouselItem>
          <CarouselItem className="basis-1/2 lg:basis-1/3">
            <Video url="https://static.higgsfield.ai/claudesfield/main-page/free-mode-banner-supercomputer.webm" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />

        <CarouselNext />
      </Carousel>
    </div>
  );
}
