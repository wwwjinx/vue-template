<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DictTypeInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addDictType, delDictType, getDictType, listDictType, updateDictType } from '@/api/system/dict'

const { sys_normal_disable } = useDict('sys_normal_disable')
const router = useRouter()

const loading = ref(false)
const total = ref(0)
const rows = ref<DictTypeInfo[]>([])
const selectedIds = ref<number[]>([])
const query = reactive({ pageNum: 1, pageSize: 10, dictName: '', dictType: '', status: '' })
const dialog = reactive({ visible: false, title: '', isEdit: false })
const formRef = ref<FormInstance>()
const form = reactive<Partial<DictTypeInfo>>({ dictName: '', dictType: '', status: '0', remark: '' })
const rules: FormRules = {
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
}

async function loadList() {
  loading.value = true
  try {
    const res = await listDictType({ ...query })
    rows.value = res?.rows ?? []
    total.value = res?.total ?? 0
  }
  finally {
    loading.value = false
  }
}

function openCreate() {
  Object.assign(form, { dictId: undefined, dictName: '', dictType: '', status: '0', remark: '' })
  dialog.title = '新增字典类型'
  dialog.isEdit = false
  dialog.visible = true
}

async function openEdit(row: DictTypeInfo) {
  Object.assign(form, await getDictType(row.dictId))
  dialog.title = '修改字典类型'
  dialog.isEdit = true
  dialog.visible = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  if (dialog.isEdit)
    await updateDictType(form)
  else
    await addDictType(form)
  ElMessage.success(dialog.isEdit ? '修改成功' : '新增成功')
  dialog.visible = false
  loadList()
}

async function onDelete(row?: DictTypeInfo) {
  const ids = row ? String(row.dictId) : selectedIds.value.join(',')
  if (!ids)
    return
  await ElMessageBox.confirm('确认删除选中的字典类型吗？', '提示', { type: 'warning' })
  await delDictType(ids)
  ElMessage.success('删除成功')
  loadList()
}

function openData(row: DictTypeInfo) {
  router.push({
    path: `/system/dict-data/index/${row.dictId}`,
    query: { dictType: row.dictType },
  })
}

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query">
      <ElFormItem label="字典名称">
        <ElInput v-model="query.dictName" clearable />
      </ElFormItem>
      <ElFormItem label="字典类型">
        <ElInput v-model="query.dictType" clearable />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect v-model="query.status" clearable style="width: 140px">
          <ElOption v-for="item in sys_normal_disable.list" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="query.pageNum = 1; loadList()">
          搜索
        </ElButton>
        <ElButton v-hasPermi="'system:dict:add'" type="primary" @click="openCreate">
          新增
        </ElButton>
        <ElButton v-hasPermi="'system:dict:remove'" type="danger" :disabled="!selectedIds.length" @click="onDelete()">
          删除
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="rows" @selection-change="(list: DictTypeInfo[]) => selectedIds = list.map(i => i.dictId)">
      <ElTableColumn type="selection" width="50" />
      <ElTableColumn prop="dictId" label="编号" width="70" />
      <ElTableColumn prop="dictName" label="字典名称" />
      <ElTableColumn prop="dictType" label="字典类型">
        <template #default="{ row }">
          <ElButton link type="primary" @click="openData(row)">
            {{ row.dictType }}
          </ElButton>
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          {{ sys_normal_disable.valueToLabel[row.status || ''] || row.status }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="remark" label="备注" />
      <ElTableColumn prop="createTime" label="创建时间" min-width="160" />
      <ElTableColumn label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'system:dict:list'" link type="primary" @click="openData(row)">
            数据
          </ElButton>
          <ElButton v-hasPermi="'system:dict:edit'" link type="primary" @click="openEdit(row)">
            修改
          </ElButton>
          <ElButton v-hasPermi="'system:dict:remove'" link type="danger" @click="onDelete(row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="pager">
      <ElPagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @current-change="loadList" @size-change="loadList"
      />
    </div>
    <ElDialog v-model="dialog.visible" :title="dialog.title" width="520px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="90px">
        <ElFormItem label="字典名称" prop="dictName">
          <ElInput v-model="form.dictName" />
        </ElFormItem>
        <ElFormItem label="字典类型" prop="dictType">
          <ElInput v-model="form.dictType" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio v-for="item in sys_normal_disable.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="form.remark" type="textarea" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialog.visible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="submit">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
