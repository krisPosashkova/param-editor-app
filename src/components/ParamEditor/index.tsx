import React, { useState, useRef, useMemo } from 'react'
import { Model, Param, ParamEditorRef } from '../../types/paramModel.ts'
import ParamEditorForm from './ParamEditorForm.tsx'

const ParamEditor: React.FC = () => {
  const editorRef = useRef<ParamEditorRef>(null)
  const [loading, setLoading] = useState(false)
  const [savedModel, setSavedModel] = useState<Model | null>(null)

  const params = useMemo<Param[]>(
    () => [
      { id: 1, name: 'Назначение', type: 'string' },
      { id: 2, name: 'Длина', type: 'string' },
    ],
    []
  )

  const initialModel: Model = {
    paramValues: [
      { paramId: 1, value: 'Повседневное' },
      { paramId: 2, value: 'Макси' },
    ],
    colors: [],
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const model = editorRef.current?.getModel()
      if (model) {
        setSavedModel(model)
        console.log('Model', model)
      }
    } finally {
      setLoading(false)
    }
  }

  const paramMap = useMemo(
    () => new Map(params.map(p => [p.id, p.name])),
    [params]
  )

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center bg-gray-100 p-6 gap-6">
      <ParamEditorForm
        ref={editorRef}
        params={params}
        model={initialModel}
        onSave={handleSave}
        loading={loading}
      />

      <div className="flex-1 flex">
        <div className="bg-gray-200 p-4 rounded-lg w-full h-full flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">
            Сохраненные параметры
          </h2>
          <ul className="space-y-2 mt-2 flex-grow">
            {savedModel?.paramValues.map(paramValue => (
              <li key={paramValue.paramId} className="flex gap-3">
                <span className="font-medium">
                  {paramMap.get(paramValue.paramId)}:
                </span>
                <span>{paramValue.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ParamEditor
