/* RAMPT */
function rampt_support_webp()
{
	var rampt_desktop_firefox_chrome_regex = /(Linux x86_64|Mac OS|Windows NT).*((Firefox\/(6[5-9]|[7-9][0-9]))|(Chrome\/[3-9][0-9]))/;
	var rampt_microsoft_browsers_regex = /Windows NT.*(Edge\/(1[8-9]|[2-9][0-9]))/;
	var rampt_android_chrome_regex = /Android.*Chrome\/[3-9][0-9].*Mobile Safari/;

	if((rampt_desktop_firefox_chrome_regex.test(navigator.userAgent) || rampt_android_chrome_regex.test(navigator.userAgent)) && navigator.userAgent.indexOf("Edge") == -1 && navigator.userAgent.indexOf("Trident") == -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}
if(window.IntersectionObserver)
{
	var rampt_observer = new IntersectionObserver(function(entries) {
			entries.forEach(function (entry) {
                    		if (entry.intersectionRatio > 0) {
                        		rampt_observer.unobserve(entry.target);
					load_rampt_img(entry.target);
				}
			});
		},
		{
			root: null,
                	rootMargin: "0px",
                	threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
		}
	);
}
/* setup_rampt_imgs prepares all rampt-img tags and img tags with data-rampt-src attribute
   It resizes them so they are ready to load the images
*/
function setup_rampt_imgs()
{
	var rampt_imgs = document.querySelectorAll("rampt-img:not(.rampt_observed)");

	for(var rampt_img_index = 0; rampt_img_index < rampt_imgs.length; rampt_img_index++)
	{
		var rampt_img = rampt_imgs[rampt_img_index];
		rampt_img.classList.add("rampt_observed");
		if(rampt_img.getAttribute("rampt_resized") != "true")
		{
			rampt_img.setAttribute("rampt_resized", "true");
			rampt_img.classList.add("i-rampthtml-layout-size-defined");
			rampt_img.classList.add("i-rampthtml-element");

			var rampt_layout = rampt_img.getAttribute("layout");

			if(rampt_layout == "responsive")
			{
				rampt_img.classList.add("i-rampthtml-layout-responsive");
			}
			else if(rampt_layout == "fixed")
			{
				rampt_img.classList.add("i-rampthtml-layout-fixed");
				rampt_img.style.width = rampt_img.getAttribute("width") + "px";
				rampt_img.style.height = rampt_img.getAttribute("height") + "px";
			}

			var rampt_img_src_width = parseInt(rampt_img.getAttribute("width"));
			var rampt_img_src_height = parseInt(rampt_img.getAttribute("height"));

			var rampt_size_ratio = (rampt_img_src_height / rampt_img_src_width) * 100;

			var rampt_sizer = document.createElement("i-rampthtml-sizer");
			rampt_sizer.style.paddingTop = rampt_size_ratio + "%"; 

			rampt_img.appendChild(rampt_sizer);

			if(window.IntersectionObserver)
			{
				if(rampt_is_in_viewport(rampt_img))
				{
					load_rampt_img(rampt_img);
				}
				else
				{
					rampt_observer.observe(rampt_img);
				}
			}
			else
			{
				load_rampt_img(rampt_img);
			}
		}
	}

	var rampt_imgs = document.querySelectorAll("img[data-rampt-src]:not(.rampt_observed)");

	for(var rampt_img_index = 0; rampt_img_index < rampt_imgs.length; rampt_img_index++)
	{
		var rampt_img = rampt_imgs[rampt_img_index];
		rampt_img.classList.add("rampt_observed");
		if(window.IntersectionObserver)
		{
			if(rampt_is_in_viewport(rampt_img))
			{
				load_rampt_img(rampt_img);
			}
			else
			{
				rampt_observer.observe(rampt_img);
			}
		}
		else
		{
			load_rampt_img(rampt_img);
		}
	}
}

/* checks is an element is visible and inside the viewport 
*/
function rampt_is_in_viewport(rampt_element)
{
	var rampt_element_bounding = rampt_element.getBoundingClientRect();

	if(rampt_element.clientWidth > 0 && rampt_element.clientHeight > 0 && rampt_element_bounding.top >= 0 && rampt_element_bounding.left >= 0 && rampt_element_bounding.right <= document.documentElement.clientWidth && rampt_element_bounding.bottom <= document.documentElement.clientHeight)
	{
		return true;
	}
	else
	{
		return false;
	}
}

/* load_rampt_img adds a loading animation and load the image in 
   the rampt-img tag
*/
function load_rampt_img(rampt_container)
{
	if(rampt_container.tagName.toLowerCase() == "img")
	{
		if(rampt_container.src == "" || rampt_container.src.indexOf("data:image/png;base64,") === 0)
		{
			if(rampt_container.dataset.webpsrc && rampt_support_webp())
			{
				rampt_container.src = rampt_container.dataset.webpsrc;
				rampt_container.setAttribute("data-fallbacksrc", rampt_container.getAttribute("data-rampt-src"));
			}
			else
			{
				rampt_container.src = rampt_container.getAttribute("data-rampt-src");
			}

			if(rampt_container.dataset.webpsrcset && rampt_support_webp())
			{
				rampt_container.srcset = rampt_container.dataset.webpsrcset;
				rampt_container.setAttribute("data-fallbacksrcset", rampt_container.dataset.webpsrcset);
			}
			else if(rampt_container.getAttribute("data-rampt-srcset"))
			{
				rampt_container.srcset = rampt_container.getAttribute("data-rampt-srcset");
			}
		}	
	}
	else if(rampt_container.querySelectorAll("img").length == 0)
	{
		rampt_container.classList.add("rampt-loading");
		var rampt_img = document.createElement("img");

		if(rampt_container.dataset.webpsrc && rampt_support_webp())
		{
			rampt_img.src = rampt_container.dataset.webpsrc;
			rampt_img.setAttribute("data-fallbacksrc", rampt_container.getAttribute("src"));
		}
		else
		{
			rampt_img.src = rampt_container.getAttribute("src");
		}

		rampt_img.alt = rampt_container.getAttribute("alt");

		if(rampt_container.dataset.webpsrcset && rampt_support_webp())
		{
			rampt_srcset = rampt_container.dataset.webpsrcset;
			rampt_img.setAttribute("data-fallbacksrcset", rampt_container.getAttribute("srcset"));
		}
		else
		{
			rampt_srcset = rampt_container.getAttribute("srcset");
		}

		var rampt_img_width = rampt_container.clientWidth;

		if(rampt_srcset != null)
		{
			var rampt_sizes = rampt_srcset.split(",");

			var rampt_smaller_size = 1000000;

			for(rampt_size_index in rampt_sizes)
			{
				var rampt_size = rampt_sizes[rampt_size_index];

				var rampt_size_reg = /\s[0-9]+w/;

				if(rampt_size_reg.test(rampt_size))
				{
					var rampt_src_size = parseInt(rampt_size.match(rampt_size_reg)[0].replace("w", ""));

					if(rampt_src_size > rampt_img_width && rampt_src_size < rampt_smaller_size)
					{
						rampt_smaller_size = rampt_src_size;

						rampt_img.src = rampt_size.replace(rampt_size_reg, "").replace(/^\s+/, "").replace(/\s+$/, "");
					}
				} 
			}

			rampt_img.srcset = rampt_srcset;
		}

		rampt_img.classList.add("i-rampthtml-fill-content");
		rampt_img.classList.add("i-rampthtml-replaced-content");

		rampt_img.setAttribute("onerror", "rampt_fallback(this);");

		rampt_container.appendChild(rampt_img);

	}
}
function rampt_fallback(this_rampt_img)
{
	if(this_rampt_img.dataset.fallbacksrc && this_rampt_img.src != this_rampt_img.dataset.fallbacksrc)
	{
		this_rampt_img.src = this_rampt_img.dataset.fallbacksrc;
	}

	if(this_rampt_img.dataset.fallbacksrcset && this_rampt_img.getAttribute("srcset") != this_rampt_img.dataset.fallbacksrcset)
	{
		this_rampt_img.setAttribute("srcset", this_rampt_img.dataset.fallbacksrcset);
	}

	this_rampt_img.removeAttribute("onerror");
}

