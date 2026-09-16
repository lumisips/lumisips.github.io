(() => {
  "use strict";

  const DATA = window.LUMISIPS_DATA || {};

  const $ = (
    selector,
    root = document
  ) =>
    root.querySelector(selector);

  const $$ = (
    selector,
    root = document
  ) =>
    [
      ...root.querySelectorAll(
        selector
      )
    ];


  /* =========================================
     SECURITY / HTML ESCAPING
  ========================================= */

  function escapeHTML(value) {

    return String(
      value ?? ""
    )

      .replaceAll(
        "&",
        "&amp;"
      )

      .replaceAll(
        "<",
        "&lt;"
      )

      .replaceAll(
        ">",
        "&gt;"
      )

      .replaceAll(
        '"',
        "&quot;"
      )

      .replaceAll(
        "'",
        "&#039;"
      );

  }



  /* =========================================
     PRODUCT COLLECTION
  ========================================= */

  function renderProducts() {

    const grid =
      $("#productGrid");


    if (
      !grid ||
      !Array.isArray(
        DATA.products
      )
    ) {
      return;
    }


    grid.innerHTML =
      DATA.products

        .map(
          product => `

            <article
              class="product-card reveal"
              style="
                --product-accent:
                ${product.accent}
              "
            >

              <div
                class="product-card-media"
              >

                <div
                  class="product-glow"
                  aria-hidden="true"
                ></div>


                <img
                  src="${escapeHTML(
                    product.image
                  )}"
                  alt="LumiSips ${escapeHTML(
                    product.sign
                  )} ${escapeHTML(
                    product.gem
                  )} bottle"
                  loading="lazy"
                  width="700"
                  height="900"
                  onerror="
                    this
                      .closest(
                        '.product-card-media'
                      )
                      .classList
                      .add(
                        'missing-product-image'
                      )
                  "
                >


                <span
                  class="product-stage"
                >

                  ${escapeHTML(
                    product.stage
                  )}

                </span>


              </div>



              <div
                class="product-card-copy"
              >


                <div
                  class="product-title-row"
                >

                  <h3>

                    ${escapeHTML(
                      product.sign
                    )}

                    ${escapeHTML(
                      product.symbol
                    )}

                  </h3>


                  <span>

                    ${escapeHTML(
                      product.gem
                    )}

                  </span>


                </div>



                <strong>

                  ${escapeHTML(
                    product.name
                  )}

                </strong>



                <p>

                  ${escapeHTML(
                    product.flavor
                  )}

                </p>


              </div>


            </article>

          `
        )

        .join("");

  }



  /* =========================================
     FULL ZODIAC GRID
  ========================================= */

  function renderZodiac() {

    const grid =
      $("#zodiacGrid");


    if (
      !grid ||
      !Array.isArray(
        DATA.zodiac
      )
    ) {
      return;
    }


    grid.innerHTML =
      DATA.zodiac

        .map(
          item => `

            <article
              class="zodiac-card"
              style="
                --zodiac-accent:
                ${item.color}
              "
            >


              <div
                class="zodiac-card-top"
              >


                <span
                  class="zodiac-symbol"
                >

                  ${escapeHTML(
                    item.symbol
                  )}

                </span>


                <span
                  class="zodiac-stage"
                >

                  ${escapeHTML(
                    item.stage
                  )}

                </span>


              </div>



              <h3>

                ${escapeHTML(
                  item.sign
                )}

              </h3>



              <p>

                ${escapeHTML(
                  item.flavor
                )}

              </p>



              <small>

                ${escapeHTML(
                  item.gem
                )}

              </small>


            </article>

          `
        )

        .join("");

  }



  /* =========================================
     PRICING
  ========================================= */

  function renderPricing() {

    const priceGrid =
      $("#priceGrid");


    const quantitySelect =
      $("#quantitySelect");



    if (
      priceGrid &&
      Array.isArray(
        DATA.pricing
      )
    ) {

      priceGrid.innerHTML =
        DATA.pricing

          .map(
            item => `

              <article
                class="
                  price-card
                  reveal
                  ${
                    item.featured
                      ? "is-featured"
                      : ""
                  }
                "
              >


                ${
                  item.featured
                    ? `
                      <span
                        class="best-value"
                      >
                        Best value
                      </span>
                    `
                    : ""
                }


                <small>

                  ${escapeHTML(
                    item.label
                  )}

                </small>


                <strong>

                  ${escapeHTML(
                    item.price
                  )}

                </strong>


                <span>

                  ${escapeHTML(
                    item.detail
                  )}

                </span>


              </article>

            `
          )

          .join("");

    }



    if (
      quantitySelect &&
      Array.isArray(
        DATA.pricing
      )
    ) {

      quantitySelect
        .insertAdjacentHTML(

          "beforeend",

          DATA.pricing

            .map(
              item => `

                <option
                  value="${
                    item.quantity
                  }"
                >

                  ${
                    item.quantity
                  }

                  ${
                    item.quantity === 1
                      ? "bottle"
                      : "bottles"
                  }

                  —

                  ${escapeHTML(
                    item.price
                  )}

                </option>

              `
            )

            .join("")

        );

    }

  }



  /* =========================================
     FIRST RELEASE FLAVOR CHOICES
  ========================================= */

  function renderFlavorChoices() {

    const target =
      $("#flavorChoices");


    if (
      !target ||
      !Array.isArray(
        DATA.products
      )
    ) {
      return;
    }


    target.innerHTML =
      DATA.products

        .map(
          (
            product,
            index
          ) => `

            <label
              class="choice-chip"
            >


              <input
                type="radio"
                name="flavor_interest"
                value="${escapeHTML(
                  product.sign
                )}"
                ${
                  index === 0
                    ? "required"
                    : ""
                }
              >


              <span>

                ${escapeHTML(
                  product.symbol
                )}

                ${escapeHTML(
                  product.sign
                )}

              </span>


            </label>

          `
        )

        .join("");

  }



  /* =========================================
     WAITLIST ZODIAC OPTIONS
  ========================================= */

  function renderWaitlistZodiac() {

    const select =
      $("#waitlistZodiac");


    if (
      !select ||
      !Array.isArray(
        DATA.zodiac
      )
    ) {
      return;
    }


    select.insertAdjacentHTML(

      "beforeend",

      DATA.zodiac

        .map(
          item => `

            <option>

              ${escapeHTML(
                item.sign
              )}

            </option>

          `
        )

        .join("")

    );

  }



  /* =========================================
     COMMUNITY VOTING
  ========================================= */

  function voteStorageKey(id) {

    return `lumisipsVote:community:${id}`;

  }



  function renderVotes() {

    const grid =
      $("#voteGrid");


    if (
      !grid ||
      !Array.isArray(
        DATA.votes
      )
    ) {
      return;
    }


    grid.innerHTML =
      DATA.votes

        .map(
          vote => `

            <article
              class="vote-card reveal"
              data-vote-card="${escapeHTML(
                vote.id
              )}"
            >


              <p
                class="vote-card-label"
              >

                ${escapeHTML(
                  vote.title
                )}

              </p>



              <h3>

                ${escapeHTML(
                  vote.prompt
                )}

              </h3>



              <div
                class="vote-options"
              >


                ${
                  vote.options

                    .map(
                      option => `

                        <button
                          type="button"
                          class="vote-option"

                          data-vote-group="community"

                          data-battle-id="${escapeHTML(
                            vote.id
                          )}"

                          data-choice="${escapeHTML(
                            option.title
                          )}"

                          aria-pressed="false"
                        >


                          <strong>

                            ${escapeHTML(
                              option.title
                            )}

                          </strong>


                          <span>

                            ${escapeHTML(
                              option.description
                            )}

                          </span>


                          <small
                            class="vote-result"
                            aria-hidden="true"
                          ></small>


                        </button>

                      `
                    )

                    .join("")
                }


              </div>


            </article>

          `
        )

        .join("");


    restoreVotes();

  }



  function restoreVotes() {

    $$(
      "[data-vote-group][data-battle-id]"
    )

      .forEach(
        button => {

          const saved =
            localStorage.getItem(
              voteStorageKey(
                button.dataset
                  .battleId
              )
            );


          const selected =
            saved ===
            button.dataset.choice;


          button.classList.toggle(
            "selected",
            selected
          );


          button.setAttribute(
            "aria-pressed",
            String(selected)
          );

        }
      );

  }



  function handleVoteClick(
    button
  ) {

    const {
      voteGroup,
      battleId,
      choice
    } =
      button.dataset;


    if (
      !voteGroup ||
      !battleId ||
      !choice
    ) {
      return;
    }



    $$(
      `[data-vote-group="${voteGroup}"][data-battle-id="${battleId}"]`
    )

      .forEach(
        item => {

          item.classList.remove(
            "selected"
          );


          item.setAttribute(
            "aria-pressed",
            "false"
          );

        }
      );



    button.classList.add(
      "selected"
    );


    button.setAttribute(
      "aria-pressed",
      "true"
    );



    localStorage.setItem(

      voteStorageKey(
        battleId
      ),

      choice

    );



    const feedback =
      $("#voteFeedback");


    if (feedback) {

      feedback.textContent =
        `Vote recorded: ${choice}`;

    }



    document.dispatchEvent(

      new CustomEvent(
        "lumisips:vote",
        {

          detail: {

            group:
              voteGroup,

            battleId,

            choice

          }

        }
      )

    );

  }



  function setupVoteClicks() {

    document.addEventListener(

      "click",

      event => {

        const button =
          event.target.closest(
            "[data-vote-group][data-battle-id]"
          );


        if (!button) {
          return;
        }


        handleVoteClick(
          button
        );

      }

    );



    document.addEventListener(

      "lumisips:vote-results",

      event => {

        const {
          group,
          battleId,
          results
        } =
          event.detail || {};


        if (
          !group ||
          !battleId ||
          !results
        ) {
          return;
        }



        const entries =
          Object.entries(
            results
          );


        const total =
          entries.reduce(

            (
              sum,
              [
                ,
                count
              ]
            ) =>
              sum +
              Number(
                count || 0
              ),

            0

          );



        $$(
          `[data-vote-group="${group}"][data-battle-id="${battleId}"]`
        )

          .forEach(
            button => {

              const count =
                Number(
                  results[
                    button.dataset.choice
                  ] || 0
                );


              const percent =
                total
                  ? Math.round(
                      (
                        count /
                        total
                      ) *
                      100
                    )
                  : 0;


              const result =
                $(
                  ".vote-result",
                  button
                );


              if (
                result &&
                total
              ) {

                result.textContent =
                  `${percent}%`;


                result.removeAttribute(
                  "aria-hidden"
                );

              }

            }
          );

      }

    );



    document.addEventListener(

      "lumisips:vote-error",

      () => {

        const feedback =
          $("#voteFeedback");


        if (feedback) {

          feedback.textContent =
            "Your selection was saved on this device, but the online vote could not be submitted.";

        }

      }

    );

  }



  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  function setupNavigation() {

    const toggle =
      $("#menuToggle");


    const nav =
      $("#primaryNav");


    if (
      !toggle ||
      !nav
    ) {
      return;
    }



    const close =
      () => {

        nav.classList.remove(
          "open"
        );


        toggle.classList.remove(
          "open"
        );


        toggle.setAttribute(
          "aria-expanded",
          "false"
        );


        document.body
          .classList
          .remove(
            "menu-open"
          );

      };



    toggle.addEventListener(

      "click",

      () => {

        const open =
          !nav.classList
            .contains(
              "open"
            );


        nav.classList.toggle(
          "open",
          open
        );


        toggle.classList.toggle(
          "open",
          open
        );


        toggle.setAttribute(
          "aria-expanded",
          String(open)
        );


        document.body
          .classList
          .toggle(
            "menu-open",
            open
          );

      }

    );



    nav.addEventListener(

      "click",

      event => {

        if (
          event.target.closest(
            "a"
          )
        ) {

          close();

        }

      }

    );



    window.addEventListener(

      "resize",

      () => {

        if (
          window.innerWidth >
          940
        ) {

          close();

        }

      }

    );

  }



  /* =========================================
     BACK TO TOP
  ========================================= */

  function setupBackToTop() {

    const button =
      $("#backTop");


    if (!button) {
      return;
    }



    const update =
      () => {

        button.classList.toggle(

          "visible",

          window.scrollY >
            650

        );

      };


    update();



    window.addEventListener(

      "scroll",

      update,

      {
        passive: true
      }

    );



    button.addEventListener(

      "click",

      () => {

        window.scrollTo({

          top: 0,

          behavior:
            "smooth"

        });

      }

    );

  }



  /* =========================================
     SCROLL REVEALS
  ========================================= */

  function setupReveal() {

    const nodes =
      $$(".reveal");


    if (
      !nodes.length
    ) {
      return;
    }



    const reducedMotion =

      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;



    if (
      reducedMotion ||
      !(
        "IntersectionObserver"
        in window
      )
    ) {

      nodes.forEach(
        node =>
          node.classList.add(
            "visible"
          )
      );


      return;

    }



    const observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target
                .classList
                .add(
                  "visible"
                );


              observer.unobserve(
                entry.target
              );

            }
          );

        },

        {

          threshold: 0.12,

          rootMargin:
            "0px 0px -40px"

        }

      );



    nodes.forEach(
      node =>
        observer.observe(
          node
        )
    );

  }



  /* =========================================
     COMMUNITY LAB EXPANDERS
  ========================================= */

  function setupIdeaModules() {

    $$(
      ".idea-module"
    )

      .forEach(
        module => {

          const action =
            $(
              ".idea-action",
              module
            );


          const update =
            () => {

              if (action) {

                action.textContent =
                  module.open
                    ? "Close"
                    : "Add idea";

              }

            };


          module.addEventListener(
            "toggle",
            update
          );


          update();

        }
      );

  }



  /* =========================================
     INITIALIZE WEBSITE
  ========================================= */

  function init() {

    renderProducts();

    renderZodiac();

    renderPricing();

    renderFlavorChoices();

    renderWaitlistZodiac();

    renderVotes();


    setupNavigation();

    setupVoteClicks();

    setupBackToTop();

    setupIdeaModules();

    setupReveal();

  }



  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(

      "DOMContentLoaded",

      init,

      {
        once: true
      }

    );

  } else {

    init();

  }

})();
