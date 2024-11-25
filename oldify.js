browser.runtime.onInstalled.addListener(() => {
  console.log("INSTALLED EXTENSION");
});

/* Newgrounds */
browser.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tabInfo) => {
    console.log(changeInfo);

    if (changeInfo.status == "complete") {
      // Get rid of current CSS
      try {
        await browser.scripting.executeScript({
          target: {
            tabId: tabId,
          },
          func: () => {

            console.log(browser.runtime.getURL("newgrounds/link_stripes.png"))
            // Global style for the images
            const styleElement = document.createElement('style');
            styleElement.textContent = `
            div.pod-head {
                background-image: url("${browser.runtime.getURL("newgrounds/podtop-gold.jpg")}") !important;
              }
            #notification-bar {
                background-image: url("${browser.runtime.getURL("newgrounds/sitelinks.png")}") !important;
            }
            
            div.notification-bar .logo a {
                background-image: url("${browser.runtime.getURL("newgrounds/logo.png")}") !important;
            }

            .featuretitle::before {
                background-image: url("${browser.runtime.getURL("newgrounds/featuretitle.jpg")}") !important;
            }

            .pod-head span a:not([class^="ngicon"]), .pod-head span button:not([class^="ngicon"]), div.podtop span a:not([class^="ngicon"]), div.podtop span button:not([class^="ngicon"]) {
              background-image: url("${browser.runtime.getURL("newgrounds/link_stripes.png")}");
              border-radius: 0px;
            }

            div.body-footer-wrapper {
              background-image: url("${browser.runtime.getURL("newgrounds/gold-footer.jpg")}") !important;
            }

            div.footer-main div.footer-navigation-cell li {
              background-image: url("${browser.runtime.getURL("newgrounds/link_stripes.png")}") !important;
              width: 163% !important;
            }


            `
            document.head.appendChild(styleElement)


            // Changing search bar on the top
            let search_bar = document.querySelector("#topsearch-elastic");
            {
              let a = search_bar.removeChild(search_bar.lastElementChild);
              let b = search_bar.removeChild(search_bar.lastElementChild);
              b.placeholder = "";
              search_bar.appendChild(a);
              search_bar.appendChild(b);
            }


            document.querySelector(".header-deck").remove();
            document.querySelector(".footer-wall-artist").remove();
            // Adding a pod-header to the News and Events pod
            let news_pod = document.querySelector("div.column:nth-child(3)")
              .children[0];
            news_pod.innerHTML =
              `<div class="pod-head" style="background-image: url(&quot;moz-extension://9268e9d0-3a49-4b6e-a606-575decd8667f/newgrounds/podtop-gold.jpg&quot;);">
        		<h2 class="pnews">News &amp; Events</h2>
          		<span>
         			  <a href="calendar">All News</a>
          		</span>
         	  </div>` + news_pod.innerHTML;

            news_pod.children[0].children[0].style["background-position"] =
              "0px -609px;";
          
            
            {
              let featureFooter = document.querySelector("#footer-feature-buttons").children[0]
              featureFooter.children[0].remove()

              let image = document.createElement("span");
              image.className = "featuretitle"
              featureFooter.insertBefore(image,featureFooter.firstChild)
            }
            
              document.querySelectorAll(`svg[class*="svgmask"]`).forEach((el) => {
                el.children[1].remove()
                
              })

            },
        });
      } catch (err) {
        console.error(`failed to execute script: ${err}`);
      }

      console.log("HUH????");
      //Insert new CSS
      try {
        await browser.scripting.insertCSS({
          target: {
            tabId: tabId,
          },
          files: ["newgrounds/new_style.css"],
          origin: "USER",
        });

        //Change the property url's
        //
      } catch (err) {
        console.error(`failed to insert css: ${err}`);
      }
      console.log(browser.runtime.getURL("newgrounds/podtop-gold.jpg"));
    }
  },
  {
    urls: ["*://*.newgrounds.com/*"],
    properties: ["title", "url", "status"],
  },
);
