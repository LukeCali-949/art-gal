const Gallery = () => {
  return (
    <div className="w-[85%] rounded-lg h-[650px] mb-[50px] mx-auto bg-white flex items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src="https://mdl.artvee.com/sftb/104779ab.jpg" alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
