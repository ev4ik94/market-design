import { LazyLoadImage } from 'react-lazy-load-image-component';

const ImageLoader = ({ image }) => (
    <div>
        <LazyLoadImage
            alt={image.alt}
            height={image.height}
            effect="blur"
            src={image.src} // use normal <img> attributes as props
            placeholderSrc={image.placeholderSrc}
            width={image.width} />

    </div>
);

export default ImageLoader;