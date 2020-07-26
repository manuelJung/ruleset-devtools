ich bin gerade dran die visualisierung von redux-ruleset zu verbessern und bin dabei auf ein ziemlich nettes tool gestoßen, um graphen zu bauen. ich hab einfach mal aus spaß die verbindungen zwischen actions (=interaktionen mit der app)  und rules (=functionen die darauf reagieren und neue interaktionen auslösen) von wucu.de da rein geworfen. Wer bock hat sich das mal anzusehen hier die anleitung:
geht zu http://webgraphviz.com/

hier müsst ihr folgenden text eingeben:
```
  digraph G {
    
  
    "*" -> "user/INITIAL_SETUP";
    "user/INITIAL_SETUP" -> "user/FINISH_SETUP";"user/INITIAL_SETUP" -> "user/SET_USER";
  

    "user/LOGIN" -> "user/AUTH0_LOGIN";
    "user/AUTH0_LOGIN" -> "#auth0-login";
  

    "user/LOGOUT" -> "user/AUTH0_LOGOUT";
    "user/AUTH0_LOGOUT" -> "#auth0-logout";
  

    "user/AUTH_0_REDIRECT" -> "user/AUTH0_REDIRECT";
    "user/AUTH0_REDIRECT" -> "#auth0-redirect";
  

    "*" -> "cart/INITIAL_FETCH";
    "cart/INITIAL_FETCH" -> "cart/FETCH_REQUEST";
  

    "cart/FETCH_REQUEST" -> "cart/FETCH";
    "cart/FETCH" -> "cart/FETCH_SUCCESS";"cart/FETCH" -> "cart/FETCH_FAILURE";
  

    "cart/ADD_ITEM_REQUEST" -> "cart/ADD_ITEM";
    "cart/ADD_ITEM" -> "cart/ADD_ITEM_SUCCESS";"cart/ADD_ITEM" -> "cart/ADD_ITEM_FAILURE";
  

    "cart/REMOVE_ITEM_REQUEST" -> "cart/REMOVE_ITEM";
    "cart/REMOVE_ITEM" -> "cart/REMOVE_ITEM_SUCCESS";"cart/REMOVE_ITEM" -> "cart/REMOVE_ITEM_FAILURE";
  

    "cart/UPDATE_ITEM_REQUEST" -> "cart/UPDATE_ITEM";
    "cart/UPDATE_ITEM" -> "cart/UPDATE_ITEM_SUCCESS";"cart/UPDATE_ITEM" -> "cart/UPDATE_ITEM_FAILURE";
  

    "wishlist/SET_WISHLIST_ID" -> "user/wishlist/TRIGGER_FETCH";
    "user/wishlist/TRIGGER_FETCH" -> "wishlist/FETCH_REQUEST";
  

    "wishlist/FETCH_REQUEST" -> "user/wishlist/FETCH";
    "user/wishlist/FETCH" -> "wishlist/FETCH_SUCCESS";"user/wishlist/FETCH" -> "wishlist/FETCH_FAILURE";
  

    "wishlist/FETCH_SUCCESS" -> "user/wishlist/TRIGGER_FETCH_GROUPED_ID_RELATIONS";"wishlist/ADD_GROUPED_ITEM_SUCCESS" -> "user/wishlist/TRIGGER_FETCH_GROUPED_ID_RELATIONS";"wishlist/ADD_LISTING_ITEM_SUCCESS" -> "user/wishlist/TRIGGER_FETCH_GROUPED_ID_RELATIONS";"wishlist/REMOVE_ITEM" -> "user/wishlist/TRIGGER_FETCH_GROUPED_ID_RELATIONS";
    "user/wishlist/TRIGGER_FETCH_GROUPED_ID_RELATIONS" -> "wishlist/FETCH_GROUPED_ID_RELATIONS_REQUEST";
  

    "wishlist/FETCH_GROUPED_ID_RELATIONS_REQUEST" -> "user/wishlist/FETCH_GROUPED_ID_RELATIONS";
    "user/wishlist/FETCH_GROUPED_ID_RELATIONS" -> "wishlist/FETCH_GROUPED_ID_RELATIONS_SUCCESS";"user/wishlist/FETCH_GROUPED_ID_RELATIONS" -> "wishlist/FETCH_GROUPED_ID_RELATIONS_FAILURE";
  

    "wishlist/ADD_GROUPED_ITEM_REQUEST" -> "user/wishlist/ADD_GROUPED_ITEM";
    "user/wishlist/ADD_GROUPED_ITEM" -> "wishlist/ADD_GROUPED_ITEM_SUCCESS";"user/wishlist/ADD_GROUPED_ITEM" -> "wishlist/ADD_GROUPED_ITEM_FAILURE";
  

    "wishlist/ADD_LISTING_ITEM_REQUEST" -> "user/wishlist/ADD_LISTING_ITEM";
    "user/wishlist/ADD_LISTING_ITEM" -> "wishlist/ADD_LISTING_ITEM_SUCCESS";"user/wishlist/ADD_LISTING_ITEM" -> "wishlist/ADD_LISTING_ITEM_FAILURE";
  

    "wishlist/REMOVE_ITEM" -> "user/wishlist/REMOVE_ITEM";
    "user/wishlist/REMOVE_ITEM" -> "#api-remove-item";
  

    "wishlist/FETCH_PRODUCTS_REQUEST" -> "user/wishlist/FETCH_PRODUCTS";
    "user/wishlist/FETCH_PRODUCTS" -> "wishlist/FETCH_PRODUCTS_SUCCESS";"user/wishlist/FETCH_PRODUCTS" -> "wishlist/FETCH_PRODUCTS_FAILURE";
  

    "wishlist/SUBSCRIBE_REQUEST" -> "user/wishlist/SUBSCRIPTION";
    "user/wishlist/SUBSCRIPTION" -> "wishlist/SUBSCRIBE_SUCCESS";"user/wishlist/SUBSCRIPTION" -> "wishlist/SUBSCRIBE_FAILURE";
  

    "wishlist/REJECT_SUBSCRIPTION" -> "user/wishlist/SAVE_REJECT_SUBSCRIPTION";
    "user/wishlist/SAVE_REJECT_SUBSCRIPTION" -> "#localstorage";
  

    "navigation/LOCATION_CHANGE" -> "ui/OPEN_PRODUCT_MODAL";
    "ui/OPEN_PRODUCT_MODAL" -> "ui/OPEN_PRODUCT_MODAL";
  

    "ui/CLOSE_PRODUCT_MODAL" -> "ui/CLEAR_URL_AFTER_PRODUCT_MODAL_CLOSE";
    "ui/CLEAR_URL_AFTER_PRODUCT_MODAL_CLOSE" -> "#url-hash";
  

    "navigation/LOCATION_CHANGE" -> "ui/CLEAR_ON_NAVIGATE";
    "ui/CLEAR_ON_NAVIGATE" -> "ui/CLEAR";
  

    "ProductWidget/CLICKOUT" -> "clickout/LISTING";
    "clickout/LISTING" -> "#clickout";
  

    "ProductModal/CLICKOUT" -> "clickout/PRODUCT_MODAL";
    "clickout/PRODUCT_MODAL" -> "#clickout";
  

    "ProductDetail/CLICKOUT" -> "clickout/PDP";
    "clickout/PDP" -> "#clickout";
  

    "analytics/SEND_EVENT" -> "tracking/SEND_EVENT";
    "tracking/SEND_EVENT" -> "#tracking-event";
  

    "analytics/SEND_BUFFERED_EVENT" -> "tracking/SEND_BUFFERED_EVENT";
    "tracking/SEND_BUFFERED_EVENT" -> "tracking-event";
  

    "wishlist/ADD_LISTING_ITEM_REQUEST" -> "feature/FORCE_WISHLIST_LOGIN";"wishlist/ADD_GROUPED_ITEM_REQUEST" -> "feature/FORCE_WISHLIST_LOGIN";
    "feature/FORCE_WISHLIST_LOGIN" -> "#open-modal";"feature/FORCE_WISHLIST_LOGIN" -> "analytics/SEND_EVENT";
  

    "user/SET_USER" -> "feature/FORCE_WISHLIST_LOGIN/ADD_TO_WISHLIST";
    "feature/FORCE_WISHLIST_LOGIN/ADD_TO_WISHLIST" -> "wishlist/ADD_GROUPED_ITEM_REQUEST";
  

    "grouped/CREATE_PRODUCT" -> "grouped/TRIGGER_FETCH_SIMPLES";
    "grouped/TRIGGER_FETCH_SIMPLES" -> "grouped/FETCH_REQUEST";
  

    "grouped/FETCH_REQUEST" -> "grouped/FETCH_SIMPLES";
    "grouped/FETCH_SIMPLES" -> "grouped/FETCH_SUCCESS";"grouped/FETCH_SIMPLES" -> "grouped/FETCH_FAILURE";
  

    "grouped/CREATE_PRODUCT" -> "grouped/SET_ACTIVE_SKU_AFTER_CREATION";
    "grouped/SET_ACTIVE_SKU_AFTER_CREATION" -> "#sub-rule";
  

    "grouped/SET_FILTER_VALUE" -> "feature/ADD_GROUPED_TO_HASH";
    "feature/ADD_GROUPED_TO_HASH" -> "#url-hash";
  

    "grouped/CREATE_PRODUCT" -> "feature/HYDRATE_GROUPED_FROM_HASH";
    "feature/HYDRATE_GROUPED_FROM_HASH" -> "grouped/CREATE_PRODUCT";
  

    "products/INIT_LIST" -> "products/TRIGGER_SEARCH";"products/SET_PAGE" -> "products/TRIGGER_SEARCH";"products/SET_PRICE_RANGE" -> "products/TRIGGER_SEARCH";"products/SET_QUERY" -> "products/TRIGGER_SEARCH";"products/TOGGLE_CATEGORY" -> "products/TRIGGER_SEARCH";"products/TOGGLE_FILTER_OPTION" -> "products/TRIGGER_SEARCH";"products/TOGGLE_TAG" -> "products/TRIGGER_SEARCH";"products/SET_INDEX" -> "products/TRIGGER_SEARCH";"products/CLEAR_FILTER_VALUES" -> "products/TRIGGER_SEARCH";
    "products/TRIGGER_SEARCH" -> "products/FETCH_REQUEST";
  

    "products/FETCH_REQUEST" -> "products/FETCH";
    "products/FETCH" -> "products/FETCH_SUCCESS";"products/FETCH" -> "products/FETCH_FAILURE";
  

    "products/INIT_LIST" -> "products/PREVENT_INITIALIZATION";
    "products/PREVENT_INITIALIZATION" -> "#cancel";
  

    "products/INIT_LIST" -> "products/ADD_CONTEXT_AFTER_MOUNT";
    "products/ADD_CONTEXT_AFTER_MOUNT" -> "products/INIT_LIST";
  

    "products/TOGGLE_CATEGORY" -> "products/ADD_CONTEXT_AFTER_HIERARCHICAL_REFINEMENT";
    "products/ADD_CONTEXT_AFTER_HIERARCHICAL_REFINEMENT" -> "products/SET_CONTEXT";
  

    "products/FETCH_SUCCESS" -> "feature/ADD_QUERY_STRING_TO_URL";
    "feature/ADD_QUERY_STRING_TO_URL" -> "#url-hash";
  

    "products/INIT_LIST" -> "feature/HYDRATE_FROM_URL";
    "feature/HYDRATE_FROM_URL" -> "products/INIT_LIST";
  

    "products/FETCH_REQUEST" -> "feature/MANUAL_SEARCH";
    "feature/MANUAL_SEARCH" -> "products/SET_ANALYTIC_TAGS";
  

    "cart/ADD_ITEM_SUCCESS" -> "feature/OPEN_CART_DRAWER";
    "feature/OPEN_CART_DRAWER" -> "ui/SET_CART_OPEN";
  

    "cart/REMOVE_ITEM_REQUEST" -> "feature/INTERCEPT_CART_ITEM_REMOVE";"cart/UPDATE_ITEM_REQUEST" -> "feature/INTERCEPT_CART_ITEM_REMOVE";
    "feature/INTERCEPT_CART_ITEM_REMOVE" -> "#open-modal";"feature/INTERCEPT_CART_ITEM_REMOVE" -> "cart/REMOVE_ITEM_REQUEST";"feature/INTERCEPT_CART_ITEM_REMOVE" -> "cart/UPDATE_ITEM_REQUEST";
  

    "products/INIT_LIST" -> "feature/RESET_CATEGORY_PAGE";
    "feature/RESET_CATEGORY_PAGE" -> "products/INIT_LIST";
  

    "*" -> "feature/SHOW_WISHLIST_SUBSCRIPTION_MODAL";
    "feature/SHOW_WISHLIST_SUBSCRIPTION_MODAL" -> "#open-modal";
  

    "cart/ADD_ITEM_REQUEST" -> "tracking/ADD_TO_CART";
    "tracking/ADD_TO_CART" -> "analytics/SEND_EVENT";
  

    "ProductWidget/CLICKOUT" -> "tracking/LIST_CLICKOUT";
    "tracking/LIST_CLICKOUT" -> "analytics/SEND_EVENT";
  

    "products/SET_PAGE" -> "tracking/filter/SET_PAGE";
    "tracking/filter/SET_PAGE" -> "analytics/SEND_EVENT";
  

    "products/TOGGLE_FILTER_OPTION" -> "tracking/filter/TOGGLE_FILTER";
    "tracking/filter/TOGGLE_FILTER" -> "analytics/SEND_EVENT";
  

    "products/TOGGLE_CATEGORY" -> "tracking/filter/TOGGLE_CATEGORY";
    "tracking/filter/TOGGLE_CATEGORY" -> "analytics/SEND_EVENT";
  

    "products/TOGGLE_TAG" -> "tracking/filter/TOGGLE_TAG";
    "tracking/filter/TOGGLE_TAG" -> "analytics/SEND_EVENT";
  

    "products/SET_PRICE_RANGE" -> "tracking/filter/SET_PRICE_RANGE";
    "tracking/filter/SET_PRICE_RANGE" -> "analytics/SEND_EVENT";
  

    "navigation/LOCATION_CHANGE" -> "tracking/LOCATION_CHANGE";
    "tracking/LOCATION_CHANGE" -> "analytics/SEND_EVENT";
  

    "ProductDetail/CLICKOUT" -> "tracking/PDP_CLICKOUT";
    "tracking/PDP_CLICKOUT" -> "analytics/SEND_EVENT";
  

    "user/FINISH_SETUP" -> "tracking/USER_STATUS";
    "tracking/USER_STATUS" -> "analytics/SEND_EVENT";
  

    "PARTIAL_STATE_UPDATES" -> "tracking/EMPTY_PRODUCT_LIST";
    "tracking/EMPTY_PRODUCT_LIST" -> "analytics/SEND_EVENT";
  

    "grouped/FETCH_SUCCESS" -> "tracking/EEC_PDP";
    "tracking/EEC_PDP" -> "analytics/SEND_EVENT";
  

    "ProductWidget/SCROLL_INTO_VIEW" -> "tracking/SCROLL_PRODUCT_INTO_VIEW";
    "tracking/SCROLL_PRODUCT_INTO_VIEW" -> "analytics/SEND_BUFFERED_EVENT";
  

    "ProductWidget/CLICK" -> "tracking/PRODUCT_CLICK";
    "tracking/PRODUCT_CLICK" -> "analytics/SEND_EVENT";
  

    "Banner/CLICK" -> "tracking/CMS_CLICK";"SimpleQuestion/CLICK" -> "tracking/CMS_CLICK";"CurratedSearchWidget/CLICK" -> "tracking/CMS_CLICK";"Image/CLICK" -> "tracking/CMS_CLICK";"ImageWithLinks/CLICK" -> "tracking/CMS_CLICK";
    "tracking/CMS_CLICK" -> "analytics/SEND_EVENT";
  

    "Banner/SCROLL_INTO_VIEW" -> "tracking/SCROLL_CMS_INTO_VIEW";"SimpleQuestion/SCROLL_INTO_VIEW" -> "tracking/SCROLL_CMS_INTO_VIEW";"CurratedSearchWidget/SCROLL_INTO_VIEW" -> "tracking/SCROLL_CMS_INTO_VIEW";"Image/SCROLL_INTO_VIEW" -> "tracking/SCROLL_CMS_INTO_VIEW";"ImageWithLinks/SCROLL_INTO_VIEW" -> "tracking/SCROLL_CMS_INTO_VIEW";
    "tracking/SCROLL_CMS_INTO_VIEW" -> "analytics/SEND_BUFFERED_EVENT";
  

    "cart/ADD_ITEM_REQUEST" -> "tracking/PRODUCT_CART_ADD";
    "tracking/PRODUCT_CART_ADD" -> "analytics/SEND_EVENT";
  

    "Header/TRIGGER_SEARCH" -> "treacking/MANUAL_SEARCH";
    "treacking/MANUAL_SEARCH" -> "analytics/SEND_EVENT";
  

    "wishlist/ADD_GROUPED_ITEM_SUCCESS" -> "tracking/ADD_WISHLIST_PRODUCT";"wishlist/ADD_LISTING_ITEM_SUCCESS" -> "tracking/ADD_WISHLIST_PRODUCT";
    "tracking/ADD_WISHLIST_PRODUCT" -> "analytics/SEND_EVENT";
  

    "wishlist/REMOVE_ITEM" -> "tracking/REMOVE_WISHLIST_PRODUCT";
    "tracking/REMOVE_WISHLIST_PRODUCT" -> "analytics/SEND_EVENT";
  

    "Sidebar/CLICK_ITEM" -> "tracking/SIDEBAR_CLICK";
    "tracking/SIDEBAR_CLICK" -> "analytics/SEND_EVENT";
  

    "ProductWidget/CLICKOUT" -> "tracking/INFORMED_CLICKOUT";"SelectionBox/CLICKOUT" -> "tracking/INFORMED_CLICKOUT";
    "tracking/INFORMED_CLICKOUT" -> "analytics/SEND_EVENT";
  

    "user/SET_USER" -> "feature/TRANSPORT_WISHLIST_ID";
    "feature/TRANSPORT_WISHLIST_ID" -> "wishlist/SET_WISHLIST_ID";
  

  "*" [color=blue];
"user/FINISH_SETUP" [color=blue];
"user/SET_USER" [color=blue];
"user/LOGIN" [color=blue];
"#auth0-login" [color=blue];
"user/LOGOUT" [color=blue];
"#auth0-logout" [color=blue];
"user/AUTH_0_REDIRECT" [color=blue];
"#auth0-redirect" [color=blue];
"cart/FETCH_REQUEST" [color=blue];
"cart/FETCH_SUCCESS" [color=blue];
"cart/FETCH_FAILURE" [color=blue];
"cart/ADD_ITEM_REQUEST" [color=blue];
"cart/ADD_ITEM_SUCCESS" [color=blue];
"cart/ADD_ITEM_FAILURE" [color=blue];
"cart/REMOVE_ITEM_REQUEST" [color=blue];
"cart/REMOVE_ITEM_SUCCESS" [color=blue];
"cart/REMOVE_ITEM_FAILURE" [color=blue];
"cart/UPDATE_ITEM_REQUEST" [color=blue];
"cart/UPDATE_ITEM_SUCCESS" [color=blue];
"cart/UPDATE_ITEM_FAILURE" [color=blue];
"wishlist/SET_WISHLIST_ID" [color=blue];
"wishlist/FETCH_REQUEST" [color=blue];
"wishlist/FETCH_SUCCESS" [color=blue];
"wishlist/FETCH_FAILURE" [color=blue];
"wishlist/ADD_GROUPED_ITEM_SUCCESS" [color=blue];
"wishlist/ADD_LISTING_ITEM_SUCCESS" [color=blue];
"wishlist/REMOVE_ITEM" [color=blue];
"wishlist/FETCH_GROUPED_ID_RELATIONS_REQUEST" [color=blue];
"wishlist/FETCH_GROUPED_ID_RELATIONS_SUCCESS" [color=blue];
"wishlist/FETCH_GROUPED_ID_RELATIONS_FAILURE" [color=blue];
"wishlist/ADD_GROUPED_ITEM_REQUEST" [color=blue];
"wishlist/ADD_GROUPED_ITEM_FAILURE" [color=blue];
"wishlist/ADD_LISTING_ITEM_REQUEST" [color=blue];
"wishlist/ADD_LISTING_ITEM_FAILURE" [color=blue];
"#api-remove-item" [color=blue];
"wishlist/FETCH_PRODUCTS_REQUEST" [color=blue];
"wishlist/FETCH_PRODUCTS_SUCCESS" [color=blue];
"wishlist/FETCH_PRODUCTS_FAILURE" [color=blue];
"wishlist/SUBSCRIBE_REQUEST" [color=blue];
"wishlist/SUBSCRIBE_SUCCESS" [color=blue];
"wishlist/SUBSCRIBE_FAILURE" [color=blue];
"wishlist/REJECT_SUBSCRIPTION" [color=blue];
"#localstorage" [color=blue];
"navigation/LOCATION_CHANGE" [color=blue];
"ui/OPEN_PRODUCT_MODAL" [color=blue];
"ui/CLOSE_PRODUCT_MODAL" [color=blue];
"#url-hash" [color=blue];
"ui/CLEAR" [color=blue];
"ProductWidget/CLICKOUT" [color=blue];
"#clickout" [color=blue];
"ProductModal/CLICKOUT" [color=blue];
"ProductDetail/CLICKOUT" [color=blue];
"analytics/SEND_EVENT" [color=blue];
"#tracking-event" [color=blue];
"analytics/SEND_BUFFERED_EVENT" [color=blue];
"tracking-event" [color=blue];
"#open-modal" [color=blue];
"grouped/CREATE_PRODUCT" [color=blue];
"grouped/FETCH_REQUEST" [color=blue];
"grouped/FETCH_SUCCESS" [color=blue];
"grouped/FETCH_FAILURE" [color=blue];
"#sub-rule" [color=blue];
"grouped/SET_FILTER_VALUE" [color=blue];
"products/INIT_LIST" [color=blue];
"products/SET_PAGE" [color=blue];
"products/SET_PRICE_RANGE" [color=blue];
"products/SET_QUERY" [color=blue];
"products/TOGGLE_CATEGORY" [color=blue];
"products/TOGGLE_FILTER_OPTION" [color=blue];
"products/TOGGLE_TAG" [color=blue];
"products/SET_INDEX" [color=blue];
"products/CLEAR_FILTER_VALUES" [color=blue];
"products/FETCH_REQUEST" [color=blue];
"products/FETCH_SUCCESS" [color=blue];
"products/FETCH_FAILURE" [color=blue];
"#cancel" [color=blue];
"products/SET_CONTEXT" [color=blue];
"products/SET_ANALYTIC_TAGS" [color=blue];
"ui/SET_CART_OPEN" [color=blue];
"PARTIAL_STATE_UPDATES" [color=blue];
"ProductWidget/SCROLL_INTO_VIEW" [color=blue];
"ProductWidget/CLICK" [color=blue];
"Banner/CLICK" [color=blue];
"SimpleQuestion/CLICK" [color=blue];
"CurratedSearchWidget/CLICK" [color=blue];
"Image/CLICK" [color=blue];
"ImageWithLinks/CLICK" [color=blue];
"Banner/SCROLL_INTO_VIEW" [color=blue];
"SimpleQuestion/SCROLL_INTO_VIEW" [color=blue];
"CurratedSearchWidget/SCROLL_INTO_VIEW" [color=blue];
"Image/SCROLL_INTO_VIEW" [color=blue];
"ImageWithLinks/SCROLL_INTO_VIEW" [color=blue];
"Header/TRIGGER_SEARCH" [color=blue];
"Sidebar/CLICK_ITEM" [color=blue];
"SelectionBox/CLICKOUT" [color=blue];

  }
```

actions sind blau und rules sind schwarz. Aus diesem Graph kann man unseren kompletten Datenfluss ablesen :D