"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Category {
  id: number;
  name: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
}

type ApiResponse<T> = T | { success: boolean; data: T };

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse<Category[]>>(
          "http://localhost:5000/categories"
        );
        // @ts-ignore
        setCategories(res.data.data);
      } catch (e: any) {
        setError(e?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const colors = ["#77b0e4", "#f6a531"];

  return (<div >
     <section className="bg-light position-relative">

	<figure className="position-absolute bottom-0 start-0 d-none d-lg-block">
		<svg width="822.2px" height="301.9px" viewBox="0 0 822.2 301.9">
			<path className="fill-warning opacity-5" d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z"></path>
		</svg>
	</figure>

	<div className="container position-relative">
		<div className="row">
			<div className="col-12">
				<div className="row align-items-center">

					<div className="col-6 col-md-3 text-center order-1 animate__fadeInTopLeft animate__animated animate__slow">
						<img src="/assets/cate2.svg" alt=""/>
					</div>

					<div className="col-md-6 px-md-5 text-center position-relative order-md-2 mb-5 mb-md-0">

						


						<h1 className="mb-3 animate__animated  animate__fadeInDown animate__slow">What do you want to learn?</h1>
						<p className="mb-3 animate__animated  animate__fadeInUp animate__slow">Grow your skill with the most reliable online courses and certifications</p>

					</div>

				
					<div className="col-6 col-md-3 text-center order-3 animate__fadeInTopRight animate__animated animate__slow">
						<img src="/assets/cate1.svg" alt=""/>
					</div>
					
				</div> 
			</div>
		</div>
	</div>
</section>
    <section className="mt-5 mb-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto text-center">
            <h2>Choose a Categories</h2>
            <p className="mb-0">
              Perceived end knowledge certainly day sweetness why cordially
            </p>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <div className="row g-4">
            {categories.length === 0 ? (
              <div className="col-12 text-center text-muted">
                No categories to show.
              </div>
            ) : (
              categories.map((item, idx) => {
                const bg = colors[idx  % colors.length ];
                return (
                  <div
                  onClick={()=>{
                    router.push(`/categories/${item.id}`)
                  }}
                    className="col-sm-6 col-md-4 col-xl-3 animate__animated animate__fadeInUp"
                    key={item.id ?? idx}
                  >
                    <div className="card card-body text-center p-4 shadow">
                      <div
                        className="mx-auto rounded-circle mb-3 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: bg,
                          width: 60,
                          height: 60,
                        }}
                      >
                        {item.cover_url && (
                          <img
                            src={item.cover_url}
                            alt={item.name}
                            style={{ width: 40, height: 40 }}
                          />
                        )}
                      </div>
                      <h5 className="mb-2">{item.name}</h5>
                      <p className="mb-0 text-muted">8 Courses</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
