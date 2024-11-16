import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { Nav, Navbar } from 'react-bootstrap';
import { animateScroll, Link } from 'react-scroll';

export function Navigation() {
  const menubarHeight = 45;
  const scrollOffset = -menubarHeight;
  const navBarWrapper = useRef(null);
  const [fixedTop, setFixedTop] = useState(false);

  const onScroll = () => {
    if (
      window.scrollY > 0 &&
      navBarWrapper.current.getBoundingClientRect().top <= 0
    ) {
      setFixedTop(true);
    } else {
      setFixedTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <div
      css={css`
        .fixed-top {
          background: white;
          box-shadow: 0 1px 4px #dee2e6;
        }
        .fixed-top .nav-link.active i {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          display: inline-block;
          width: 85%;
          height: 3px;
          margin: auto;
          background-color: #4169e2;
        }
      `}
      ref={navBarWrapper}
    >
      <Navbar
        className={fixedTop ? 'fixed-top' : null}
        css={css`
          justify-content: center;
          background: #f7f7f7;
          border-top: 1px solid #dee2e6;
          border-bottom: 1px solid #dee2e6;
          padding: 2px;
          height: ${menubarHeight}px;

          .nav-link {
            position: relative;
            cursor: pointer;
          }
        `}
      >
        <Nav>
          <Link
            className="nav-link"
            to="global-slide"
            offset={scrollOffset}
            spy={true}
            smooth={true}
          >
            국가별현황
            <i />
          </Link>
          <Link
            className="nav-link"
            to="global-chart-slide"
            offset={scrollOffset}
            spy={true}
            smooth={true}
          >
            글로벌차트
            <i />
          </Link>
          <Link
            className="nav-link"
            to="korea-chart-slide"
            offset={scrollOffset}
            spy={true}
            smooth={true}
          >
            국내차트
            <i />
          </Link>
          <Link
            className="nav-link"
            to="youtube-slide"
            offset={scrollOffset}
            spy={true}
            smooth={true}
          >
            유튜브
            <i />
          </Link>
        </Nav>
      </Navbar>

      {fixedTop ? (
        <div
          css={css`
              position: fixed;
              bottom: 15px;
              right: 15px;
              background-color: white;
              border-radius: 15px;
              z-index: 800;
              width: 32px;
              height: 32px;
              text-align: center;
              border: 1px solid #dee2e6;
              a {
                color: black;
              }
              box-shadow: 0 1px 4px #dee2e6;
            `}
        >
          <a href="#top" onClick={() => animateScroll.scrollToTop()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill='currentColor'
              className='bi bi-chevron-up'
              viewBox='0 0 16 16'
            >
              <path d='M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L85.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z' />
            </svg>
          </a>
        </div>
      ): null}
    </div>
  );
}
