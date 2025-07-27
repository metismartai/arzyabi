import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { useApproachesData } from '../hooks/useApproachesData';
import '../styles/ApproachesTable.css';

const ApproachesTable = () => {
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const { data, criteria, loading, setData, saveToJSON } = useApproachesData();

  React.useEffect(() => {
    if (criteria.length > 0 && !selectedCriterion) {
      setSelectedCriterion(criteria[0]);
    }
  }, [criteria, selectedCriterion]);

  const handleCellClick = (rowId, field, currentValue) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue || '');
  };

  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleCellSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const updatedData = data.map(item => {
        if (item.id === editingCell.rowId) {
          return { ...item, [editingCell.field]: editValue };
        }
        return item;
      });
      setData(updatedData);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellCancel = (e) => {
    if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const saveChanges = async () => {
    const result = await saveToJSON(data);
    if (result.success) {
      alert('تغییرات با موفقیت ذخیره شد!');
    } else {
      alert('خطا در ذخیره‌سازی: ' + result.message);
    }
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(data.map(item => ({
      'عنوان معیار': item.criteriaTitle,
      'کد معیار': item.criteriaCode,
      'کد زیرمعیار': item.subCriteriaCode,
      'کد رویکرد': item.approachCode,
      'عنوان رویکرد': item.approachTitle,
      'شرح رویکرد و جاری سازی': item.approachDescription,
      'ارزیابی و بهبود و یادگیری': item.evaluation,
      'کد شاخص های مرتبط': Array.isArray(item.relatedIndexes) ? item.relatedIndexes.join('|') : item.relatedIndexes
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'approaches_updated.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  const filteredData = data.filter(item => item.criteriaTitle === selectedCriterion);

  const renderEditableCell = (item, field, value) => {
    const isEditing = editingCell && editingCell.rowId === item.id && editingCell.field === field;
    
    if (isEditing) {
      if (field === 'approachDescription' || field === 'evaluation') {
        return (
          <textarea
            value={editValue}
            onChange={handleCellChange}
            onBlur={handleCellSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleCellSubmit(e);
              } else if (e.key === 'Escape') {
                handleCellCancel(e);
              }
            }}
            className="form-control cell-input textarea-input"
            autoFocus
            style={{
              width: '100%',
              height: '120px',
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        );
      } else {
        return (
          <input
            type="text"
            value={editValue}
            onChange={handleCellChange}
            onBlur={handleCellSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellSubmit(e);
              } else if (e.key === 'Escape') {
                handleCellCancel(e);
              }
            }}
            className="form-control cell-input"
            autoFocus
            style={{
              width: '100%',
              height: '40px'
            }}
          />
        );
      }
    }

    return (
      <div
        className="editable-cell"
        onClick={() => handleCellClick(item.id, field, value)}
        title="کلیک کنید برای ویرایش"
        style={{
          minHeight: field === 'approachDescription' || field === 'evaluation' ? '80px' : '40px',
          width: '100%',
          padding: '8px'
        }}
      >
        {value || <span className="text-muted">کلیک برای ویرایش</span>}
      </div>
    );
  };

  return (
    <div className="approaches-table-container">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 bg-light menu p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-center">معیارها</h3>
              <Link to="/" className="btn btn-outline-primary btn-sm">
                <i className="fas fa-home"></i>
                خانه
              </Link>
            </div>
            <ul className="list-group">
              {criteria.map((criterion, index) => (
                <li
                  key={index}
                  className={`list-group-item ${selectedCriterion === criterion ? 'active' : ''}`}
                  onClick={() => setSelectedCriterion(criterion)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-folder"></i>
                  {criterion}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link to="/approaches" className="btn btn-success w-100 mb-2">
                <i className="fas fa-cards"></i>
                نمایش کارتی
              </Link>
              <button onClick={saveChanges} className="btn btn-primary w-100 mb-2">
                <i className="fas fa-save"></i>
                ذخیره تغییرات
              </button>
              <button onClick={exportToCSV} className="btn btn-info w-100">
                <i className="fas fa-download"></i>
                دانلود CSV
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 p-4">
            <div className="page-header">
              <h1 className="text-center mb-4">
                <i className="fas fa-table"></i>
                {selectedCriterion ? ` جدول رویکردهای معیار: ${selectedCriterion}` : ' جدول رویکردها'}
              </h1>
              <div className="alert alert-info">
                <i className="fas fa-info-circle"></i>
                برای ویرایش هر سلول، روی آن کلیک کنید. برای ذخیره از Enter و برای لغو از Escape استفاده کنید.
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="table table-bordered table-hover approaches-table">
                <thead className="table-dark">
                  <tr>
                    <th style={{width: '120px'}}>کد رویکرد</th>
                    <th style={{width: '200px'}}>عنوان رویکرد</th>
                    <th style={{width: '350px'}}>شرح رویکرد</th>
                    <th style={{width: '350px'}}>ارزیابی و بهبود</th>
                    <th style={{width: '200px'}}>شاخص‌های مرتبط</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{renderEditableCell(item, 'approachCode', item.approachCode)}</td>
                      <td>{renderEditableCell(item, 'approachTitle', item.approachTitle)}</td>
                      <td>{renderEditableCell(item, 'approachDescription', item.approachDescription)}</td>
                      <td>{renderEditableCell(item, 'evaluation', item.evaluation)}</td>
                      <td>{renderEditableCell(item, 'relatedIndexes', Array.isArray(item.relatedIndexes) ? item.relatedIndexes.join('|') : item.relatedIndexes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproachesTable;
