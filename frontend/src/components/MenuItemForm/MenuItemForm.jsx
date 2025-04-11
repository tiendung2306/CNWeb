
import React, { useState } from 'react'
import { AlertCircle } from "lucide-react"
import './MenuItemForm.css'

const defaultMenuItem = {
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: '',
}

const MenuItemForm = ({ initialValue = defaultMenuItem, onSubmit, onCancel }) => {
    const [formValue, setFormValue] = useState(initialValue)
    const [error, setError] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValue({
            ...formValue,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        })
        if (error[name]) {
            setError({
                ...error,
                [name]: '',
            })
        }
    }
    const validateForm = () => {
        const newErrors = {}
        if (!formValue.name.trim()) {
            newErrors.name = 'Tên sản phẩm không được để trống'
        }
        if (!formValue.description.trim()) {
            newErrors.description = 'Mô tả sản phẩm không được để trống'
        }
        if (!formValue.imageUrl.trim()) {
            newErrors.imageUrl = 'URL hình ảnh không được để trống'
        }
        if (!formValue.category.trim()) {
            newErrors.category = 'Danh mục không được để trống'
        }
        if (!formValue.price <= 0) {
            newErrors.price = 'Giá sản phẩm không hợp lệ'
        }
        setError(newErrors)
        return Object.keys(newErrors).length === 0
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formValue)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Tên sản phẩm</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formValue.name}
                    onChange={handleChange}
                    className={error.name ? "input-error" : ""}
                />
                {error.name && (
                    <p className="error-msg">
                        <AlertCircle className="icon" />
                        {error.name}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                    id="description"
                    name="description"
                    value={formValue.description}
                    onChange={handleChange}
                    className={error.description ? "input-error" : ""}
                    rows={2}
                />
                {error.description && (
                    <p className="error-msg">
                        <AlertCircle className="icon" />
                        {error.description}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="price">Giá ($)</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formValue.price}
                    onChange={handleChange}
                    className={error.price ? "input-error" : ""}
                />
                {error.price && (
                    <p className="error-msg">
                        <AlertCircle className="icon" />
                        {error.price}
                    </p>
                )}
            </div>

            {/* <div className="form-group">
        <Label htmlFor="category">Category</Label>
        <Select value={formValues.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className={errors.category ? "input-error" : ""}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="error-msg">
            <AlertCircle className="icon" />
            {errors.category}
          </p>
        )}
      </div> */}
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <textarea
                    id="category"
                    type="text"
                    name="category"
                    value={formValue.category}
                    onChange={handleChange}
                    className={error.category ? "input-error" : ""}
                    rows={1}
                />
                {error.category && (
                    <p className="error-msg">
                        <AlertCircle className="icon" />
                        {error.category}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                    id="imageUrl"
                    name="imageUrl"
                    value={formValue.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />
                {formValue.imageUrl && (
                    <div className="image-preview">
                        <p className="preview-label">Preview:</p>
                        <img
                            src={formValue.imageUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="preview-image"
                            onError={(e) => {
                                e.target.src = "/placeholder.svg?height=80&width=80"
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </button>
                <button type="submit">{initialValue.id ? "Chỉnh sửa" : "Thêm"} sản phẩm</button>
            </div>
        </form>
    )
}

export default MenuItemForm
