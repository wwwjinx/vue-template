<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { MenuInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addMenu, delMenu, getMenu, listMenu, updateMenu } from '@/api/system/menu'
import { handleTree } from '@/utils/tree'

const { sys_normal_disable, sys_show_hide } = useDict('sys_normal_disable', 'sys_show_hide')

const loading = ref(false)
const menus = ref<MenuInfo[]>([])
const query = reactive({ menuName: '', status: '' })
const dialog = reactive({ visible: false, title: '', isEdit: false })
const formRef = ref<FormInstance>()
const form = reactive<Partial<MenuInfo>>({
  parentId: 0,
  menuType: 'C',
  menuName: '',
  orderNum: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  visible: '0',
  status: '0',
  isFrame: 1,
  isCache: 0,
  remark: '',
})
const rules: FormRules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择类型', trigger: 'change' }],
}

const menuOptions = computed(() => [
  { menuId: 0, menuName: '根目录', children: menus.value },
])

async function loadList() {
  loading.value = true
  try {
    const rows = (await listMenu({ ...query })) ?? []
    menus.value = handleTree(rows as unknown as Record<string, unknown>[], 'menuId', 'parentId') as unknown as MenuInfo[]
  }
  finally {
    loading.value = false
  }
}

function resetForm(parentId = 0) {
  Object.assign(form, {
    menuId: undefined,
    parentId,
    menuType: 'C',
    menuName: '',
    orderNum: 0,
    path: '',
    component: '',
    perms: '',
    icon: '',
    visible: '0',
    status: '0',
    isFrame: 1,
    isCache: 0,
    remark: '',
  })
}

function openCreate(row?: MenuInfo) {
  resetForm(row?.menuId ?? 0)
  dialog.title = '新增菜单'
  dialog.isEdit = false
  dialog.visible = true
}

async function openEdit(row: MenuInfo) {
  const detail = await getMenu(row.menuId)
  Object.assign(form, detail)
  dialog.title = '修改菜单'
  dialog.isEdit = true
  dialog.visible = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  if (dialog.isEdit)
    await updateMenu(form)
  else
    await addMenu(form)
  ElMessage.success(dialog.isEdit ? '修改成功' : '新增成功')
  dialog.visible = false
  loadList()
}

async function onDelete(row: MenuInfo) {
  await ElMessageBox.confirm(`确认删除菜单「${row.menuName}」吗？`, '提示', { type: 'warning' })
  await delMenu(row.menuId)
  ElMessage.success('删除成功')
  loadList()
}

const typeLabel: Record<string, string> = { M: '目录', C: '菜单', F: '按钮' }

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query">
      <ElFormItem label="菜单名称">
        <ElInput v-model="query.menuName" clearable />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect v-model="query.status" clearable style="width: 140px">
          <ElOption v-for="item in sys_normal_disable.list" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="loadList">
          搜索
        </ElButton>
        <ElButton v-hasPermi="'system:menu:add'" type="primary" @click="openCreate()">
          新增
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="menus" row-key="menuId" default-expand-all :tree-props="{ children: 'children' }">
      <ElTableColumn prop="menuName" label="菜单名称" min-width="160" />
      <ElTableColumn prop="icon" label="图标" width="90" />
      <ElTableColumn prop="orderNum" label="排序" width="70" />
      <ElTableColumn prop="perms" label="权限标识" min-width="160" />
      <ElTableColumn prop="component" label="组件路径" min-width="180" />
      <ElTableColumn label="类型" width="80">
        <template #default="{ row }">
          {{ typeLabel[row.menuType || ''] || row.menuType }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="可见" width="80">
        <template #default="{ row }">
          {{ sys_show_hide.valueToLabel[row.visible || ''] || row.visible }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          {{ sys_normal_disable.valueToLabel[row.status || ''] || row.status }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'system:menu:add'" link type="primary" @click="openCreate(row)">
            新增
          </ElButton>
          <ElButton v-hasPermi="'system:menu:edit'" link type="primary" @click="openEdit(row)">
            修改
          </ElButton>
          <ElButton v-hasPermi="'system:menu:remove'" link type="danger" @click="onDelete(row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDialog v-model="dialog.visible" :title="dialog.title" width="640px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="90px">
        <ElFormItem label="上级菜单">
          <ElTreeSelect
            v-model="form.parentId"
            :data="menuOptions"
            node-key="menuId"
            :props="{ label: 'menuName', children: 'children' }"
            check-strictly
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="菜单类型" prop="menuType">
          <ElRadioGroup v-model="form.menuType">
            <ElRadio value="M">
              目录
            </ElRadio>
            <ElRadio value="C">
              菜单
            </ElRadio>
            <ElRadio value="F">
              按钮
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="菜单名称" prop="menuName">
          <ElInput v-model="form.menuName" />
        </ElFormItem>
        <ElFormItem label="显示排序" prop="orderNum">
          <ElInputNumber v-model="form.orderNum" :min="0" />
        </ElFormItem>
        <ElFormItem v-if="form.menuType !== 'F'" label="路由地址">
          <ElInput v-model="form.path" />
        </ElFormItem>
        <ElFormItem v-if="form.menuType === 'C'" label="组件路径">
          <ElInput v-model="form.component" placeholder="如 system/user/index" />
        </ElFormItem>
        <ElFormItem v-if="form.menuType !== 'M'" label="权限标识">
          <ElInput v-model="form.perms" />
        </ElFormItem>
        <ElFormItem v-if="form.menuType !== 'F'" label="图标">
          <ElInput v-model="form.icon" />
        </ElFormItem>
        <ElFormItem v-if="form.menuType !== 'F'" label="显示状态">
          <ElRadioGroup v-model="form.visible">
            <ElRadio v-for="item in sys_show_hide.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="菜单状态">
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
