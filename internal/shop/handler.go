package shop

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	supa "nissyo/internal/supabase"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func coalesce(ptr *string, fallback string) string {
	if ptr != nil {
		return *ptr
	}
	return fallback
}

func maskPhone(phone *string) *string {
	if phone == nil {
		return nil
	}
	p := strings.TrimSpace(*phone)
	if len(p) < 4 {
		masked := "****"
		return &masked
	}
	masked := "***-***-" + p[len(p)-4:]
	return &masked
}

// GetShopListHandler 店舗一覧を取得するハンドラー
func GetShopListHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	q := url.Values{}
	q.Set("select", strings.Join([]string{
		"id", "spid", "department_no", "accounting_category", "store_name", "store_name_furigana",
		"store_name_short", "phone_number", "url", "mail", "is_web", "web_management_id",
		"web_management_url", "hostess_page_url", "hostess_list_url",
		"hostess_attendance_management_url", "hostess_management_url",
		"send_hsprofile", "send_hsattend", "send_hsjob", "send_ctpoint",
		"send_hsstart", "send_hsranking", "course_fee_style", "nomination_fee_style",
		"gm_category", "nomination_fee", "extension_fee", "extension_per_minutes",
		"standard_transportation_expenses", "cancel_fee", "is_membership_card",
		"customer_point_initial_former", "customer_point_initial_latter",
		"is_nomination_plusback", "membership_number_management", "change_fee",
		"card_commission", "standard_hostess_recieve_rate", "extension_style",
		"extension_hostess_recieve_rate", "panel_nomination_fee", "star_price",
		"group_no", "business_style", "former_start", "former_end",
		"latter_start", "latter_end", "is_hs_send_room_no", "is_hs_send_end",
		"created_at", "updated_at",
	}, ","))
	q.Set("order", "created_at.asc")
	q.Set("limit", "200")

	body, _, getErr := client.Get(ctx, "/rest/v1/shop", q)
	if getErr != nil {
		log.Printf("DB_001: supabase get error: %v", getErr)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "database fetch error"})
		return
	}

	var rows []ShopDTO
	if err := json.Unmarshal(body, &rows); err != nil {
		log.Printf("DB_002: json decode error: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_002", Message: "response decode error"})
		return
	}

	// パスワードは返却しない（セキュリティ）
	for i := range rows {
		rows[i].WebManagementPW = nil
	}

	c.JSON(http.StatusOK, rows)
}

// GetShopDetailHandler 店舗詳細を取得するハンドラー
func GetShopDetailHandler(c *gin.Context) {
	id := c.Param("id")
	if strings.TrimSpace(id) == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Code: "VAL_001", Message: "missing id"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	q := url.Values{}
	q.Set("select", strings.Join([]string{
		"id", "spid", "department_no", "accounting_category", "store_name", "store_name_furigana",
		"store_name_short", "phone_number", "url", "mail", "is_web", "web_management_id",
		"web_management_url", "hostess_page_url", "hostess_list_url",
		"hostess_attendance_management_url", "hostess_management_url",
		"send_hsprofile", "send_hsattend", "send_hsjob", "send_ctpoint",
		"send_hsstart", "send_hsranking", "course_fee_style", "nomination_fee_style",
		"gm_category", "nomination_fee", "extension_fee", "extension_per_minutes",
		"standard_transportation_expenses", "cancel_fee", "is_membership_card",
		"customer_point_initial_former", "customer_point_initial_latter",
		"is_nomination_plusback", "membership_number_management", "change_fee",
		"card_commission", "standard_hostess_recieve_rate", "extension_style",
		"extension_hostess_recieve_rate", "panel_nomination_fee", "star_price",
		"group_no", "business_style", "former_start", "former_end",
		"latter_start", "latter_end", "is_hs_send_room_no", "is_hs_send_end",
		"created_at", "updated_at",
	}, ","))
	q.Set("id", "eq."+id)
	q.Set("limit", "1")

	body, _, getErr := client.Get(ctx, "/rest/v1/shop", q)
	if getErr != nil {
		log.Printf("DB_001: supabase get error: %v", getErr)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "database fetch error"})
		return
	}

	var rows []ShopDTO
	if err := json.Unmarshal(body, &rows); err != nil {
		log.Printf("DB_002: json decode error: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_002", Message: "response decode error"})
		return
	}

	if len(rows) == 0 {
		c.JSON(http.StatusNotFound, ErrorResponse{Code: "DB_404", Message: "shop not found"})
		return
	}

	shop := rows[0]
	// パスワードは返却しない（セキュリティ）
	shop.WebManagementPW = nil

	c.JSON(http.StatusOK, shop)
}

