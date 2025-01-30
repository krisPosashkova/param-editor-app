import {
  Model,
  Param,
  ParamEditorRef,
  ParamValue,
} from '../../types/paramModel.ts'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useReducer,
} from 'react'

interface Props {
  params: Param[]
  model: Model
  onSave: () => void
  loading: boolean
}

export const ParamEditorForm = forwardRef<ParamEditorRef, Props>(
  ({ params, model, onSave, loading }, ref) => {
    const paramReducer = (
      state: Map<number, string>,
      action: { type: 'update'; paramId: number; value: string }
    ) => {
      if (action.type === 'update') {
        return new Map(state).set(action.paramId, action.value)
      }
      return state
    }

    const [paramValues, dispatch] = useReducer(
      paramReducer,
      new Map(model?.paramValues.map(({ paramId, value }) => [paramId, value]))
    )

    const getModel = useCallback((): Model => {
      const newParamValues: ParamValue[] = Array.from(
        paramValues.entries()
      ).map(([paramId, value]) => ({
        paramId,
        value,
      }))

      return {
        ...model,
        paramValues: newParamValues,
      }
    }, [paramValues, model])

    useImperativeHandle(ref, () => ({
      getModel,
    }))

    const handleParamChange = useCallback(
      (paramId: number) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          dispatch({ type: 'update', paramId, value: event.target.value })
        },
      []
    )

    return (
      <div className="w-full bg-white rounded-lg p-6 flex flex-col flex-1">
        <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Редактор параметров
        </h1>
        <form className="space-y-4 w-full">
          {params.map(param => {
            const commonProps = {
              id: `param-${param.id}`,
              value: paramValues.get(param.id) ?? '',
              className:
                'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
            }

            return (
              <div key={param.id} className="flex flex-col">
                <label
                  htmlFor={commonProps.id}
                  className="text-gray-600 text-sm font-medium mb-1"
                >
                  {param.name}
                </label>

                {param.type === 'string' && (
                  <input
                    {...commonProps}
                    type="text"
                    onChange={event => handleParamChange(param.id)(event)}
                  />
                )}

                {param.type === 'number' && (
                  <input
                    {...commonProps}
                    type="number"
                    onChange={event => handleParamChange(param.id)(event)}
                  />
                )}

                {param.type === 'select' && (
                  <select
                    {...commonProps}
                    value={paramValues.get(param.id) ?? ''}
                    onChange={event =>
                      handleParamChange(param.id)(
                        event as React.ChangeEvent<HTMLSelectElement>
                      )
                    }
                  >
                    <option value="">Выберите значение</option>
                    {(param.options || []).map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )
          })}
        </form>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onSave}
            disabled={loading}
            aria-busy={loading}
            className="min-w-40 h-10 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition relative flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin border-t-2 border-white rounded-full w-5 h-5"></span>
            ) : (
              <span className="h-5 leading-5">Сохранить</span>
            )}
          </button>
        </div>
      </div>
    )
  }
)

export default ParamEditorForm
