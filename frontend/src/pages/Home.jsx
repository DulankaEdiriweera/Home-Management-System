import React, { useState, useEffect } from 'react';

const Home = () => {
  // Slideshow state and functionality
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: "Home Inventory Management",
      description: "Keep track of all your household items in one place",
      image: "/src/assets/inventory_slider.jpg"
    },
    {
      id: 2,
      title: "Task Management",
      description: "Organize family tasks and track completion",
      image: "/src/assets/tasks_slider.jpg"
    },
    {
      id: 3,
      title: "Expense Tracking",
      description: "Monitor and manage your household budget",
      image: "/src/assets/expenses_slider.avif"
    },
    {
      id: 4,
      title: "Smart Shopping Lists",
      description: "Never forget an item with collaborative lists",
      image: "/src/assets/shopping_slider2.jpg"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-container flex flex-col w-full overflow-x-hidden">
      {/* Slideshow Section */}
      <div className="slideshow-container w-full relative overflow-hidden mb-8 bg-gray-100">
        <div className="slideshow-inner w-full h-[70vh] relative">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="slide-content absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h2 className="text-2xl font-bold">{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="slide-indicators absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${index === activeSlide ? 'bg-white' : 'bg-gray-400'}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content w-full max-w-full mx-auto px-4">
        <div className="header-section text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Simplifying <span className="text-blue-500">home management</span> for a smoother, stress-free life
          </h1>
          <p className="text-xl text-gray-600">
            The all-in-one solution to manage your home effortlessly—track inventory, create smart shopping lists, monitor expenses, and stay on top of household tasks with ease!" 🏡
          </p>
        </div>

        <div className="trust-section text-center mb-12">
          <h2 className="text-2xl font-bold">
            Effortless <span className="text-blue-500">home management</span> – trusted by families everywhere
          </h2>
        </div>

        <div className="features-section">
          {/* Inventory Section */}
          <div className="feature-block flex flex-col md:flex-row items-center mb-12">
            <div className="feature-image md:w-1/3 mb-4 md:mb-0">
              <img src="/src/assets/inventry_home.jpg" alt="Inventory management" className="rounded-lg" />
            </div>
            <div className="feature-content  md:w-2/3 md:pl-40">
              <h2 className="text-4xl font-bold mb-4">Inventory</h2>
              <p className="text-2xl mb-9">Organize and track your home inventory effortlessly</p>
              <div className="text-xl text-gray-600">
                <p>Add an item</p>
                <p>View items</p>
                <p>Remove items</p>
                <p>Discover low stock items and those close to expiry</p>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="feature-block flex flex-col md:flex-row-reverse items-center mb-12">
            <div className="feature-image md:w-1/3 mb-4 md:mb-0">
              <img src="/src/assets/task_home.webp" alt="Task management" className="rounded-lg" />
            </div>
            <div className="feature-content md:w-2/3 md:pl-40">
              <h2 className="text-4xl font-bold mb-4">Tasks</h2>
              <p className="text-2xl mb-9">Simplify your household tasks—get more done with less effort</p>
              <div className="text-xl text-gray-600">
                <p>Add tasks</p>
                <p>View tasks</p>
                <p>Schedule tasks</p>
                <p>Create recurring tasks and notify users about missed tasks</p>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="feature-block flex flex-col md:flex-row items-center mb-12">
            <div className="feature-image md:w-1/3 mb-4 md:mb-0">
              <img src="/src/assets/Family-planning-budget.webp" alt="Expense tracking" className="rounded-lg" />
            </div>
            <div className="feature-content md:w-2/3 md:pl-40">
              <h2 className="text-4xl font-bold mb-4">Expenses</h2>
              <p className="text-2xl mb-9">Track, save, and manage your household expenses effortlessly</p>
              <div className="text-xl text-gray-600">
                <p>Add expenses</p>
                <p>View expenses</p>
                <p>Remove expenses</p>
                <p>Notify users when expenses exceed a set limit</p>
              </div>
            </div>
          </div>

          {/* Shopping List Section */}
          <div className="feature-block flex flex-col md:flex-row-reverse items-center mb-12">
            <div className="feature-image md:w-1/3 mb-4 md:mb-0">
              <img src="/src/assets/shoppinglist-home.avif" alt="Shopping list" className="rounded-lg" />
            </div>
            <div className="feature-content md:w-2/3 md:pl-40">
              <h2 className="text-4xl font-bold mb-4">Shopping List</h2>
              <p className="text-2xl mb-9">Never forget an item again—smart shopping list management</p>
              <div className="text-xl text-gray-600">
                <p>Add list and new items</p>
                <p>View list and new items</p>
                <p>Remove list and new items</p>
                <p>Mark as "Purchased" or select quantity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section text-center py-8 bg-gray-100 ">
          <h2 className="text-4xl font-bold mb-4">Try <span className="text-blue-500">Home Track</span></h2>
          <p className="text-2xl mb-9">
            Easily track your household inventory, groceries, expenses, and tasks – all in one place for a more organized home.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Home;
