"use client";

import { useState } from "react";
import "../Style/ReadMoreContent.css";

export default function ReadMoreContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="readmore-section">
      <div className="readmore-container">
        <h2 className="readmore-title">
          India's Best Home Decorative Items Online
        </h2>

        <div
          className={`readmore-content ${
            expanded ? "expanded" : ""
          }`}
        >
          <p>
            Isn't decorating your home one of the most satisfying
            endeavors? The home is like a canvas; yours to beautify the
            way you like! It is a reflection of your personality and
            design aesthetics, and this is what makes every home unique.
            In the same way that you hand-pick each item for your home,
            we at Creator Handicrafts lovingly curate our entire
            collection.
          </p>

          <p>
            Every <a href="#">home decor item</a>,
            <a href="#"> Wall Décor</a>,
            <a href="#"> Kitchen Décor</a>,
            <a href="#"> Room Décor</a>,
            <a href="#"> Coffee and Center Tables</a>,
            <a href="#"> Planters</a>,
            <a href="#"> Lamps</a> you see at Creator Handicrafts has
            been selected for its versatility, beauty, workmanship,
            quality and durability.
          </p>

          <h3>Get Home Decor Items Online At Best Price</h3>

          <p>
            All <strong>home decoration items online</strong> sold at
            <strong> Creator Handicrafts</strong> are designed in line
            with international standards & specifications.
          </p>

          <p>
            We take pride in handpicking our home décor products which
            enables us to deliver the best products at competent prices
            to our patrons. With accurate pricing and guaranteed 7 day
            delivery, you can shop from our
            <strong> home decor online</strong> website from the comfort
            of your home and complete peace of mind.
          </p>

          <p>
            Not just that, we also take the "Price Match Guarantee" on
            any of our products that you may find for a cheaper price
            elsewhere! Home décor online buying is a breeze with Creator
            Handicrafts.
          </p>

          <h3>
            The Benefits of Buying Home Decor Items from Creator
            Handicrafts
          </h3>

          <ol>
            <li>
              Authentic home products that live up to your expectations
              with their breathtaking designs.
            </li>

            <li>
              Focus on product quality across categories to ensure you
              get only the most premium range.
            </li>

            <li>
              Affordable pricing that does not burn a hole in your
              pocket every time you pick something for your space.
            </li>

            <li>
              Products across all home categories for every different
              theme, mood and home personality, all under one roof.
            </li>
          </ol>

          <h3>Buy from Trusted Home Decor Products Brands Online</h3>

          <p>
            At Creator Handicrafts we follow a curated marketplace model
            wherein home items are directly procured from the
            manufacturers. Thus, cutting the additional and unnecessary
            middlemen costs so that you can shop as frequently as you
            like.
          </p>

          <p>
            Furthermore, these manufacturers are handpicked vendors who
            match our strict quality control requirements. As a result,
            whatever you buy from us comes with a promise of sturdiness
            and exceptional quality.
          </p>

          <h3>
            Why Creator Handicrafts Is The Favorite Online Home Decor
            Accessories Store?
          </h3>

          <p>
            When you get everything related to home décor and essentials
            in one place, why won't it be your favorite go-to place for
            shopping?
          </p>

          <p>
            Especially when we have a wide range of items that cater to
            any and every home décor need that you may have!
          </p>

          <p>
            Whether you are celebrating Christmas or Diwali, you will
            always find the right Diwali decoration items & Christmas
            decoration items sets here.
          </p>

          <p>
            And since our prices are very reasonable, you can give your
            home a makeover every now and then without worrying about a
            dent in your budget!
          </p>

          <h3>
            Shop Creator Handicrafts Homeware Products Online by
            Category
          </h3>

          <p>
            Creator Handicrafts is an Indian e-commerce platform that
            offers a wide range of products, including home decor items.
          </p>

          <p>
            When it comes to home décor, Creator Handicrafts online
            shopping offers a variety of options to improve the look of
            your living areas.
          </p>

          <p>
            You can find Creator Handicrafts home decor products in
            various categories, such as:
          </p>

          <h3>1. Shop Home Decor Items Online</h3>

          <p>
            How you do up your walls decor, what you put on your
            shelves, and the way you light up the rooms, are all
            critical elements when it comes to interior design.
          </p>

          <p>
            At Creator Handicrafts, you can shop
            <a href="#"> decorative lamps</a> & lightings, wall decor
            items, showpieces & vases, religious & spiritual items, to
            set the right mood, as well as fancy vases to add some
            flower power.
          </p>

          <p>
            These are just a few of the more amazing things we have in
            store for you.
          </p>

          <h3>2. Popular Home décor Products:</h3>

          <p>
            Gold Coraline Chandelier, Table Lamp, Vintage Station Wall
            Clock, Metal Wall Clock, Retro Station
            <a href="#"> Wall Clock</a>, Red Vintage Car Wall Art,
            <a href="#"> Metal Wall Art</a>, Metal Wall Clock, Peacock
            Wall Decor and more!
          </p>

          <h3>3. Shop Garden Decor Online</h3>

          <p>
            The garden is everyone's safe sanctuary. It is amidst the
            plants that you feel energised and refreshed.
          </p>

          <p>
            Whether you have a full-fledged garden or a balcony that is
            filled with greens, you can select your type of garden decor
            items online at Creator Handicrafts.
          </p>

          <p>
            Not just pots and <a href="#">planters</a> or plants &
            seeds, Creator Handicrafts has an amazing range of garden
            accessories too!
          </p>

          <p>
            If you have a green thumb or want to try your hand at
            gardening, treat yourself to our plants and seeds section.
          </p>

          <p>
            Phew! That's a long list of what Creator Handicrafts has to
            offer for your home. As we promised, we're a one-stop shop
            for all your home needs!
          </p>

          <h3>Why Creator Handicrafts ?</h3>

          <p>
            Discover the unique charm of
            <strong> Creator Handicrafts</strong>, where every piece is
            crafted with passion and precision.
          </p>

          <p>
            Our metal wall art, elegant wall clocks, stylish planters,
            and chic coffee and center tables aren't just products —
            they're statements.
          </p>

          <p>
            Each item is meticulously designed to enhance your space
            with artistic flair and functional beauty.
          </p>

          <p>
            By choosing Creator Handicrafts, you support artisans who
            blend traditional techniques with contemporary design,
            ensuring that each creation is not only beautiful but also
            meaningful.
          </p>
        </div>

        <button
          className="readmore-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? "Hide less Information"
            : "See all Information"}
        </button>
      </div>
    </section>
  );
}